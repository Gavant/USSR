# Univeral Server Side Rendering
“In Soviet Russia, the server renders you.”


---

#### TODO: The entire README
- Note about playwright executable post-install

## Testing the Lambda Locally

Since playwrite doesn't support Amazon Linux 2, we had to create our own custom runtime based on debian. Lucky for us, the the bullseye node docker images are built on debian! Hurray! 

All steps were mainly followed or modified from the following guide: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-image.html if this readme doesn't provide enough clarity this document here has a lot of the steps followed to get this custom runtime working.

We created our own custom dockerfile which will do the following:
1. Build a custom lambda image that contains all of our USSR dependencies.
2. Installs the AWS Lambda runtime interface client
3. Setups easy ENTRYPOINT/CMD for the project

### Building the lambda image locally
In order to test the lambda locally, we first need to build it's image:
```
docker build --platform linux/amd64 --no-cache --progress=plain -t ussr .
```

This creates a new image called `ussr` which we will use for testing.

### Actually Testing the lambda image locally
With image in hand, the next step is to install the AWS Lambda emulator which will allows us to emulate the lambda function on our own machine.

This spins up a docker container with the lambda running that can be sent events like it would if was deployed.

To install the emulator run the following commands:
```
mkdir -p ~/.aws-lambda-rie && \
    curl -Lo ~/.aws-lambda-rie/aws-lambda-rie https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie && \
    chmod +x ~/.aws-lambda-rie/aws-lambda-rie
```

NOTE: If using an arm64 image, need to install the arm64 emulator (shouldn't need this for this project):
```
mkdir -p ~/.aws-lambda-rie && \
    curl -Lo ~/.aws-lambda-rie/aws-lambda-rie https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie-arm64 && \
    chmod +x ~/.aws-lambda-rie/aws-lambda-rie
```

Next its time to spin up the local lambda emulator pointing to our image and function:
```
docker run --platform linux/amd64 -d -v ~/.aws-lambda-rie:/aws-lambda -p 9000:8080 \
    --entrypoint /aws-lambda/aws-lambda-rie \
    ussr \
        /usr/local/bin/npx aws-lambda-ric dist/main.handler
```

Things to keep in mind:
1. `ussr` in the command above is the custom runtime image that we built, this can be replaced with any other lambda image containing the code, for example if I instead tagged it as `ussr:latest` that would be what goes there
2. `/usr/local/bin/npx aws-lambda-ric` is the entrypoint, this probably doesn't change ever unless you have a custom `.sh` script which calls that
3. `dist/main.handler` is the command the lambda runs, specically it runs the `handler` function within `dist/main.js` (after its built).

Now to actually invoke the lambda run the following:
```
curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```
This sends an empty event to the lambda function.

If you want to test with a simpler lambda function that just returns a "Hello World" type response, an example is in the root of the repo as `index.cjs`. To test spin up the emulator while pointing to this simple function:
```
docker run --platform linux/amd64 -d -v ~/.aws-lambda-rie:/aws-lambda -p 9000:8080 \
    --entrypoint /aws-lambda/aws-lambda-rie \
    ussr \
        /usr/local/bin/npx aws-lambda-ric index.handler
```