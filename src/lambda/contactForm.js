export function handler(event, context, callback) {
    const data = JSON.parse(event.body);
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({ message: "This is it!" })
    });
}