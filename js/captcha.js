const captchaApiUrl = "https://captcha.web.cern.ch/api/v1.0";

class CaptchaApiClient {
    baseUrl = captchaApiUrl;

    _formatUrl(relativeUrl) {
        return `${this.baseUrl}/${relativeUrl}`;
    }

    async _request(relativeUrl, options = {}) {
        if (options.method !== "GET") {
        options.headers = { "Content-Type": "application/json" };
        }
        return await (await fetch(this._formatUrl(relativeUrl), options)).json();
    }

    getCaptcha() {
        return this._request("captcha");
    }

    getCaptchaAudioUrl(captchaId) {
        return this._formatUrl(`captcha/audio/${captchaId}`);
    }

   isCaptchaCorrect(captchaId, captchaAnswer) {
        let endpoint = this._formatUrl(`captcha/`);

        return fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Origin': 'null'
                },
                body: JSON.stringify({ "answer": captchaAnswer, "id": captchaId })
        })
        .then((response) => {
            return response.json().then((data) => {
                return data;
            }).catch((err) => {
                console.log(err);
            })
        });
    }
      
}
const client = new CaptchaApiClient();

const Captcha = () => {

    let captchaResponse;
    let showAudio;

    const reload = async () => {
        captchaResponse = await client.getCaptcha();
        showAudio = false;
        document.getElementById("cern-captcha").innerHTML = template(captchaResponse.id, captchaResponse.img);
        document.getElementById("reload").addEventListener("click", reload);
    }

    const template2 = (id, img) => `
    <p>
    Please enter the correct value as displayed below to continue to your File Download
    </p>
    <img
    alt="captcha"
    name="captchaResponseImg"
    style="margin-bottom: 4px"
    src="${img}"
    />
    <Button id="reload" type="button">
    Reload
    </Button>

    <label>Answer:</label>
    <input
    name="captchaAnswer"
    type="text"
    id="captchaAnswer"
    />
    <input
    name="captchaId"
    type="hidden"
    id="captchaId"
    value="${id}"
    />
    `

    const template = (id, img) => `
        <div class="container">
    <div class="text-center">
        <h1>File Download</h1>
    </div>
    <div class="row justify-content-center">
        <div class="col-md-6">
        <p>Please enter the correct value as displayed below to continue to your File Download:</p>
        <img alt="captcha" name="captchaResponseImg" style="margin-bottom: 4px" src="${img}">
        <button id="reload" type="button" class="btn btn-secondary">Reload</button>
        <br />&nbsp;<br />
        <div class="form-group">
            <label for="captchaAnswer"><b>Answer:</b></label>
            <input name="captchaAnswer" type="text" id="captchaAnswer" class="form-control">
            <input name="captchaId" type="hidden" id="captchaId" value="${id}">
        </div>
        </div>
    </div>
    </div>
    `

    const audioTemplate = (audioUrl) => `
    <audio controls="controls" className="audio-element">
        <source src="${audioUrl}" />
    </audio>
    `

    reload();
}

document.addEventListener("load", Captcha());

window.onload = function() {
    var form = document.querySelector("form");
    form.onsubmit = submitted.bind(form);
}

function submitted(event) {
    // need this to prevent the page from refreshing after clicking submit, which interrupts our API call
    event.preventDefault();
    let captchaAnswer = document.getElementById("captchaAnswer").value;
    let captchaId = document.getElementById("captchaId").value;

    client.isCaptchaCorrect(captchaId, captchaAnswer).then((data) => {
        console.log(JSON.stringify(data));
        let jsonData = JSON.stringify(data);

        if (jsonData.includes("Valid")) {
            downloadpage = `
            <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download Page</title>
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <!-- Bootstrap JS -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</head>
<body>
  <div class="container">
    <div class="text-center mt-5">
      <h1>Download Starting</h1>
      <p class="lead">Your download will begin shortly......</p>
      <i class="fas fa-spinner fa-pulse fa-3x"></i>
    </div>
  </div>
</body>
</html>
  `
            document.write(downloadpage);
            setTimeout(function() {
                shareFile();
              }, 1000);
        }
        else {
            $('#captchaErrorModal').modal('show');
            document.getElementById("reload").click();
        }
    });
}

$(document).ready(function() {
    $('#closeModalButton').click(function() {
      $('#captchaErrorModal').modal('hide');
    });
    $('#closeModalButton2').click(function() {
        $('#captchaErrorModal').modal('hide');
      });
});