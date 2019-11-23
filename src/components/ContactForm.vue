<template>
  <div>
    <h1>Contact</h1>
    <p>Some contact message</p>
    <form class="vue-form" @submit.prevent="submit">
      <div>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label" for="email">Email</label>
          <div class="col-sm-10">
            <input
              class="form-control"
              type="email"
              name="email"
              id="email"
              required
              :class="{ email , error: !email.valid }"
              v-model="email.value"
            />
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label" for="textarea">Message</label>
          <div class="col-sm-10">
            <textarea
              rows="10"
              class="form-control"
              name="textarea"
              id="textarea"
              aria-describedby="textAreaInfo"
              required
              v-model="message.text"
              :maxlength="message.maxlength"
            ></textarea>
            <!-- <small id="textAreaInfo" class="form-text text-muted">
  Your information in this field .
            </small>-->
          </div>
        </div>
        <div>
          <button type="submit" class="btn btn-primary mb-2">Submit</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
const kbpgp = require("kbpgp");

const httpClient = axios.create({
  baseURL: process.env.VUE_APP_FORM_SUBMISSION_URL,
  headers: {
      "Content-Type": "application/json",
      // anything you want to add to the headers
  }
});

export default {
  name: "ContactForm",
  keymanager: {},
  props: [],
  data() {
    return {
      email: {
        value: "johndoe@myemail.com",
        valid: true
      },
      message: {
        text: "Dear debpu06,\n...",
        maxlength: 500
      },
      submitted: false,
      emailRegExp: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    };
  },
  methods: {
    // submit form handler
    submit: function() {
      this.submitted = true;
      this.encryptMessage(this.message.text);
    },
    // check for valid email adress
    isEmail: function(value) {
      return this.emailRegExp.test(value);
    },
    // validate by type and value
    validate: function(type, value) {
      if (type === "email") {
        this.email.valid = this.isEmail(value);
      }
    },

    // build keymanager from public key in config
    buildKeyManager: function() {
      var promise = new Promise(function(resolve, reject) {
        var public_key = process.env.VUE_APP_PGP_PUBLIC_KEY;
        
        kbpgp.KeyManager.import_from_armored_pgp(
          {
            armored: public_key
          },
          function(err, manager) {
            if (!err) {
              console.log(manager);
              resolve(manager);
            } else {
              reject(err);
              console.log("managerError", err);
            }
          }
        );
      });
      return promise;
    },

    encryptMessage: function(message) {
      var _this = this;
      this.buildKeyManager().then(
        function(manager) {
          var params = {
            msg: message,
            encrypt_for: manager
          };

          kbpgp.box(params, function(err, result_string, result_buffer) {
            console.log(err, result_string, result_buffer);
            _this.message.text = result_string;
            _this.postForm(result_string);
          });
        },
        function(error) {
          console.log(error);
        }
      );
    },

    postForm: function(email, message){
        httpClient.post(`https://davidboland.site/api/contact`, {
          body: { email: email, message: message }
        })
        .then(response => 
        {
          if(response.success) {
             console.log("Success"); 
          }
        })
        .catch(e => {
        this.errors.push(e)
      })
    }
  },
  watch: {
    // watching nested property
    "email.value": function(value) {
      this.validate("email", value);
    }
  }
};
</script>