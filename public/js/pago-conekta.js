const loader = document.getElementById("preloader_container");
const pagarBtn = document.getElementById("pagar_btn");
const modal = document.getElementById("modal");
const modalBtn = document.getElementById("modalBtn");
const modalText = document.getElementById("modal_text");

let privateKey = "Bearer key_ixHyfwR1QKEtuCP8qXbVDQ";
let publicKey = "key_Er9ywVWsJu2nfsUPM6Zksyw";

modalBtn.addEventListener("click", async (e) => {
  modal.style.display = "none";
});

pagarBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  document.getElementById("preloader_container").style.display = "flex";
  setAnimation();

  deleteAnimationInterval = setInterval(deleteAnimation, 1100);
  setAnimationInterval = setInterval(setAnimation, 2200);

  try {
    const token = await new Promise(getToken);
    const datosOrden = obtenerDatosOrden();
    const reciboPagado = await pagar(token, datosOrden);
    // showModal("Pago realizado" + reciboPagado.payment_status);
    confirmacion();
  } catch (error) {
    showModal("Pago rechazado \n" + error.message);
    // alert("Hubo un error con tu pago verifica tus datos o intentalo mas tarde");
  }
});

function showModal(message) {
  loader.style.display = "none";
  modal.style.display = "flex";
  modalText.innerText = message;
}

function confirmacion() {
  loader.style.display = "none";
  modal.style.display = "flex";
  window.location.href = "http://localhost:3000/citas/pagos/confirmacion";
}

function getToken(resolve, reject) {
  let tarjetahabiente = document.getElementById("tarjetahabiente").value;
  let numero = document.getElementById("numero").value;
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
            // Objeto de Metadatos para ingresar información de interés de tu comercio y después recuperarlo por Reporting, puedes ingresar máximo 100 elementos y puedes ingresar caracteres especiales
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
                //"monthly_installments": 3, //Este parámetro se usa para incluir MSI en cargo único
                type: "default",
              },
            },
          ],
          discount_lines: [
            {
              code: "Cupón de descuento en orden sin cargo",
              amount: 0,
              type: "loyalty", //'loyalty', 'campaign', 'coupon' o 'sign'
            },
          ],
          tax_lines: [
            {
              description: "IVA",
              amount: 0,
              metadata: {
                // Objeto de Metadatos para ingresar información de interés de tu comercio y después recuperarlo por Reporting, puedes ingresar máximo 100 elementos y puedes ingresar caracteres especiales
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

// esta función se ejecuta al cargar la página de pago para obtener el precio del mes, previamente seleccionado
function setPrecio() {
  const url_string = window.location.href;
  const url = new URL(url_string);
  const param = url.searchParams.get("mes");

  fetch("http://localhost:3000/precioMes?id=" + param)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("precio").innerText = data[0].precio;
      document.getElementById("mes").innerText = data[0].mes.toUpperCase();
    });
}

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
