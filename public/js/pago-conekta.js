const loader = document.getElementById("preloader_container");
const pagarBtn = document.getElementById("pagar_btn");
const modal = document.getElementById("modal");
const modalError = document.getElementById("modal-error");
const modalBtn = document.getElementById("modalBtnError");
const modalText = document.getElementById("modal_text");
const modalTextError = document.getElementById("modal_text_error");
const errorMessage = document.getElementById("error-message");
const HOST = location.protocol + "//" + location.host;

let privateKey = "Bearer key_ixHyfwR1QKEtuCP8qXbVDQ";
let publicKey = "key_Er9ywVWsJu2nfsUPM6Zksyw";

modalBtn.addEventListener("click", async (e) => {
  // modal.style.display = "none";
  modalError.style.display = "none";
});

const formPago = document.getElementById("pago-form");

formPago.addEventListener("change", () => {
  formValidation();
});

pagarBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const validation = formValidation();
  if (validation === 0) {
    document.getElementById("preloader_container").style.display = "flex";
    setAnimation();

    deleteAnimationInterval = setInterval(deleteAnimation, 1100);
    setAnimationInterval = setInterval(setAnimation, 2200);

    try {
      const token = await new Promise(getToken);
      const datosOrden = obtenerDatosOrden();
      const reciboPagado = await pagar(token, datosOrden);
      console.log(reciboPagado);
      // showModal("Pago realizado" + reciboPagado.payment_status);
      confirmacion(reciboPagado);
    } catch (error) {
      console.error(error);
      showModalError(error.message_to_purchaser);
      // alert("Hubo un error con tu pago verifica tus datos o intentalo mas tarde");
    }
  }
});

function formValidation() {
  let errors = 0;
  const tarjetaHabiente = document.getElementById("tarjetahabiente");
  const numeroTarjeta = document.getElementById("numerotarjeta");
  const mes = document.getElementById("exp-mes");
  const ano = document.getElementById("exp-ano");
  const cvv = document.getElementById("cvc");
  const email = document.getElementById("correo");
  const contrasena = document.getElementById("contrasena");
  const telefono = document.getElementById("telefono");

  const tarjetaHabienteV = tarjetaHabiente.value.trim();
  const numeroTarjetaV = numeroTarjeta.value.trim();
  const mesV = mes.value.trim();
  const anoV = ano.value.trim();
  const cvvV = cvv.value.trim();
  const emailV = email.value.trim();
  const contrasenaV = contrasena.value.trim();
  const telefonoV = telefono.value.trim();

  if (tarjetaHabienteV === "" || null) {
    setErrorFor(tarjetahabiente, "El Nombre es un valor requerido");
    errors++;
  } else {
    setSuccessFor(tarjetahabiente);
  }
  if (numeroTarjetaV === "" || null) {
    setErrorFor(numeroTarjeta, "El n??mero de tarjeta es requerido");
    errors++;
  } else if (!isNumberValid(numeroTarjetaV)) {
    setErrorFor(numeroTarjeta, "N??mero de tarjeta inv??lido");
    errors++;
  } else {
    setSuccessFor(numeroTarjeta);
  }

  if (mesV === "" || null) {
    setErrorFor(mes, "Mes requerido");
    errors++;
  } else if (mesV.length != 2) {
    setErrorFor(mes, "Mes inv??lido");
    errors++;
  } else {
    setSuccessFor(mes);
  }
  if (anoV === "" || null) {
    setErrorFor(ano, "A??o requerido");
    errors++;
  } else if (anoV.length != 4) {
    setErrorFor(ano, "A??o inv??lido");
    errors++;
  } else {
    setSuccessFor(ano);
  }

  if (cvvV === "" || null) {
    setErrorFor(cvv, "C??digo requerido");
    errors++;
  } else {
    setSuccessFor(cvv);
  }

  if (emailV === "") {
    setErrorFor(email, "El correo es obligatorio");
    errors++;
  } else if (!isEmail(emailV)) {
    setErrorFor(email, "Correo inv??lido");
    errors++;
  } else {
    setSuccessFor(email);
  }

  if (contrasenaV === "" || null) {
    setErrorFor(contrasena, "Contrase??a obligatoria");
    errors++;
  } else {
    setSuccessFor(contrasena);
  }
  if (telefonoV === "" || null) {
    setErrorFor(telefono, "Tel??fono requerido");
    errors++;
  } else {
    setSuccessFor(telefono);
  }

  return errors;
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");
  formControl.className = "form-control error";
  small.innerText = message;
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

function isNumberValid(number) {
  const regex = /^[0-9]*$/;
  return regex.test(number);
}

function showModal(message) {
  loader.style.display = "none";
  modal.style.display = "flex";
}

function showModalError(message) {
  loader.style.display = "none";
  modalError.style.display = "flex";
  errorMessage.innerHTML = message;
}
async function confirmacion(recibo) {
  let correo = document.getElementById("correo").value;
  const order_id = recibo.id;
  // window.location.href = `${HOST}/citas/pagos/confirmacion?orderId=${order_id}`;

  try {
    const mailSend = await fetch(`${HOST}/citas/api/sendmail/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        order_id,
        correo,
      }),
    });

    loader.style.display = "none";

    if (mailSend.ok) {
      window.location.href = `${HOST}/citas/pagos/confirmacion?orderId=${order_id}&sendMail=true`;
    } else {
      window.location.href = `${HOST}/citas/pagos/confirmacion?orderId=${order_id}&sendMail=false`;
    }
  } catch (error) {
    console.error(error);
  }
}

function getToken(resolve, reject) {
  let tarjetahabiente = document.getElementById("tarjetahabiente").value;
  let numero = document.getElementById("numerotarjeta").value;
  let cvc = document.getElementById("cvc").value;
  let expMes = document.getElementById("exp-mes").value;
  let expAno = document.getElementById("exp-ano").value;

  let data = {
    card: {
      number: numero,
      name: tarjetahabiente,
      exp_year: expAno,
      exp_month: expMes,
      cvc: cvc,
    },
  };

  function successToken(token) {
    resolve(token);
  }

  function errorToken(err) {
    /* err keys: object, type, message, message_to_purchaser, param, code */
    reject(err);
  }

  //Definir la llave ppublica dependiendo de la sucursal
  Conekta.setPublicKey(publicKey);
  Conekta.Token.create(data, successToken, errorToken);
}

const pagar = function (token, datosOrden) {
  return new Promise(async function (resolve, reject) {
    try {
      const opcionesCrearCliente = {
        method: "POST",
        // mode: "no-cors",
        headers: {
          //Definir llave privada dependiendo de la sucursal
          // "Access-Control-Allow-Origin": "http://127.0.0.1:5500/INNATE/pago.html",
          Authorization: privateKey,
          Accept: "application/vnd.conekta-v2.0.0+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          livemode: false,
          name: datosOrden.paciente,
          email: datosOrden.correo,
          phone: datosOrden.telefono,
          payment_sources: [
            {
              type: "card",
              token_id: token.id, //Token paso anterior response.id
            },
          ],
        }),
      };

      const createClient = await fetch(
        "https://api.conekta.io/customers",
        opcionesCrearCliente
      );

      const client = await createClient.json();
      const opcionesCrearOrden = {
        method: "POST",
        headers: {
          //Definir llave privada dependiendo de la sucursal
          Authorization: privateKey,
          Accept: "application/vnd.conekta-v2.0.0+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: datosOrden.precioCentavos,
          currency: "MXN",
          amount_refunded: 0,
          customer_info: {
            customer_id: client.id, //Id del cliente paso anterior
          },

          metadata: {
            Integration: "API", //Nos indica que te has integrado por tu cuenta utilizando la API Conekta
            Integration_Type: "PHP 8.0", //Nos menciona el lenguaje que utilizas para integrarte
            // Objeto de Metadatos para ingresar informaci??n de inter??s de tu comercio y despu??s recuperarlo por Reporting, puedes ingresar m??ximo 100 elementos y puedes ingresar caracteres especiales
          },
          line_items: [
            {
              //Informacion de la orden
              name: "Cita sucursal del valle",
              unit_price: datosOrden.precioCentavos,
              quantity: 1,
              description: "Description",
            },
          ],
          charges: [
            {
              payment_method: {
                //"monthly_installments": 3, //Este par??metro se usa para incluir MSI en cargo ??nico
                type: "default",
              },
            },
          ],
          discount_lines: [
            {
              code: "Cup??n de descuento en orden sin cargo",
              amount: 0,
              type: "loyalty", //'loyalty', 'campaign', 'coupon' o 'sign'
            },
          ],
          tax_lines: [
            {
              description: "IVA",
              amount: 0,
              metadata: {
                // Objeto de Metadatos para ingresar informaci??n de inter??s de tu comercio y despu??s recuperarlo por Reporting, puedes ingresar m??ximo 100 elementos y puedes ingresar caracteres especiales
                IEPS: "1800",
              },
            },
          ],
        }),
      };

      const createOrder = await fetch(
        "https://api.conekta.io/orders",
        opcionesCrearOrden
      );
      const order = await createOrder.json();
      if (createOrder.ok) {
        resolve(order);
      } else {
        reject({ message: order.details[0].debug_message });
      }
    } catch (error) {
      reject(error);
    }
  });
};

function obtenerDatosOrden() {
  let datosForm;
  let paciente = document.getElementById("tarjetahabiente").value;
  let correo = document.getElementById("correo").value;
  let telefono = document.getElementById("telefono").value;

  datosForm = {
    paciente,
    correo,
    telefono,
    precioCentavos: "49099", //Asignar el precio de la cita en centavos
  };

  return datosForm;
}

// esta funci??n se ejecuta al cargar la p??gina de pago para obtener el precio del mes, previamente seleccionado
// function setPrecio() {
//   const url_string = window.location.href;
//   const url = new URL(url_string);
//   const param = url.searchParams.get("mes");

//   fetch("http://localhost:3000/precioMes?id=" + param)
//     .then((response) => response.json())
//     .then((data) => {
//       document.getElementById("precio").innerText = data[0].precio;
//       document.getElementById("mes").innerText = data[0].mes.toUpperCase();
//     });
// }

//Amnimation
function setAnimation() {
  document.getElementById("_1").style.animation = "bloque 0.5s";
  document.getElementById("_2").style.animation = "disco 0.5s 0.1s";
  document.getElementById("_3").style.animation = "bloque 0.5s 0.2s";
  document.getElementById("_4").style.animation = "disco 0.5s 0.3s";
  document.getElementById("_5").style.animation = "bloque 0.5s 0.4s";
  document.getElementById("_6").style.animation = "disco 0.5s 0.5s";
  document.getElementById("_7").style.animation = "bloque 0.5s 0.6s";
}

function deleteAnimation() {
  document.getElementById("_1").style.animation = "";
  document.getElementById("_2").style.animation = "";
  document.getElementById("_3").style.animation = "";
  document.getElementById("_4").style.animation = "";
  document.getElementById("_5").style.animation = "";
  document.getElementById("_6").style.animation = "";
  document.getElementById("_7").style.animation = "";
}
