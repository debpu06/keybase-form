<template>
  <div>
    <h1>Contact</h1>
    <p>PGP encryption capable form</p>
    <form v-if="!submitted" class="vue-form" @submit.prevent="submit">
      <div>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label" for="email">Email</label>
          <div class="col-sm-10">
            <input class="form-control"
              placeholder="joe.secure@myemail.com"
              type="email"
              name="email"
              id="email"
              required
              :class="{ email , error: !email.valid }"
              v-model="email.value"
            />
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else. Your email will be encrypted in the message.</small>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label" for="textarea">Message</label>
          <div class="col-sm-10">
            <textarea
              rows="10"
              placeholder="Dear secure friend, ..."
              class="form-control"
              name="textarea"
              id="textarea"
              aria-describedby="textAreaInfo"
              required
              v-model="message.text"
              :maxlength="message.maxlength"
            ></textarea>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-sm-10 offset-sm-2">
            <div v-if="waitingForAction" class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>  
            <button :disabled="waitingForAction" type="button" v-on:click="encryptSubmit" class="btn btn-outline-info btn-lg btn-block">Encrypt</button>
            <button :disabled="waitingForAction" type="submit" class="btn btn-primary btn-lg btn-block">Submit</button>     
          </div>
        </div>
      </div>
    </form>
    <p v-if="submitted" v-text="submissionResponse">   
    </p>
  </div>
</template>

<script>

const kbpgp = require("kbpgp");

export default {
  name: "ContactForm",
  keymanager: {},
  props: [],
  data() {
    return {
      email: {
        value: "",
        valid: true
      },
      message: {
        text: "",
        maxlength: 1000
      },
      submissionResponse: "",
      submitted: false,
      waitingForAction: false,
      emailRegExp: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    };
  },
  methods: {
    // submit form handler
    submit: function() {
      this.waitingForAction = true;
      const url = '/.netlify/functions/contactForm';
      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: this.message.text
        })
      };
      var _this = this;
      fetch(url, options)
      .then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log('Email Submission:', data.message);
        _this.waitingForAction = false;
        _this.submissionResponse = data.message;
        _this.submitted = true;
      });
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
        kbpgp.KeyManager.import_from_armored_pgp(
          {
            armored: process.env.VUE_APP_PGP_PUBLIC_KEY
          },
          function(err, manager) {
            if (!err) {
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

    // verify valid email and some message content is set before encrypting
    encryptSubmit: function(){
      if(this.email.valid && this.message.text){
        this.waitingForAction = true;
        this.encryptMessage("sender: " + this.email.value + "\n\n" + this.message.text);
      }
    },

    // encrypt some text
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
            _this.waitingForAction = false;
          });
        },
        function(error) {
          console.log(error);
        }
      );
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