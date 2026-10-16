const { VerifyNivel } = require("./findUtils");

function Hateoas(value, url, nivel, module, getRoutes) {
    nivel = VerifyNivel(nivel);
    let get = [];
    let hateoas;

    if (nivel == "admin") {
        hateoas = {
            GET: `${url + nivel + "/" + module + "/" + getRoutes}`,
            POST: `${url + nivel + "/" + module + "/new/"}`,
            PUT: `${url + nivel + "/" + module + "/update/" + value}`,
            DELETE: `${url + nivel + "/" + module + "/delete/" + value}`
        };
    };

    if (nivel == "secretaria") {
        if (module == "secretaria") {
            hateoas = {
                GET: `${url + nivel + "/" + module + "/" + getRoutes}`,
            };
        } else {
            hateoas = {
                GET: `${url + nivel + "/" + module + "/" + getRoutes}`,
                POST: `${url + nivel + "/" + module + "/new/"}`,
                PUT: `${url + nivel + "/" + module + "/update/" + value}`,
                DELETE: `${url + nivel + "/" + module + "/delete/" + value}`
            };
        };
    };

    if (nivel == "usuario" || nivel == "associacao") {
        hateoas = {
            GET: `${url + nivel + "/" + module + "/" + getRoutes}`,
        };
    };

    if (getRoutes.length < 2) {
        return hateoas;
    };

    if (Array.isArray(getRoutes)) {
        getRoutes.forEach((element) => {
            get.push(`${url + nivel + "/" + module + "/" + element}`);
        });

        hateoas.GET = get;
    };

    return hateoas;
};

module.exports = Hateoas;