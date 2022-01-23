"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.form = exports.iyzico = void 0;
const Iyzipay = require("iyzipay");
const firebase_1 = require("./config/firebase");
const iyzico_1 = require("./config/iyzico");
const iyzico = async (req, res) => {
    try {
        iyzico_1.iyzipay.checkoutForm.retrieve({
            locale: Iyzipay.LOCALE.TR,
            conservationId: '14789632',
            token: req.body.token,
        }, async (err, result) => {
            console.log('resul12t', result.itemTransactions[0]);
            if (result.paymentStatus === 'SUCCESS') {
                const ticket = firebase_1.db.collection('tickets').doc();
                const ticketObject = {
                    id: ticket.id,
                    eventId: result.itemTransactions[0].itemId.split('-')[0],
                    userId: result.itemTransactions[0].itemId.split('-')[1],
                    ticketName: result.itemTransactions[0].itemId.split('-')[2],
                    read: false,
                };
                await ticket.set(ticketObject);
                res.send(`
                <!DOCTYPE html>
                <html>
                  <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1 ">
                  </head> 
                  <body>
                  <center> 
                  <div style="margin-top:60px">  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                  width="256" height="256"
                  viewBox="0 0 172 172"
                  style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="none" stroke-linecap="none" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none" stroke="none" stroke-width="1" stroke-linecap="butt"></path><g><path d="M86,21.5c-35.62237,0 -64.5,28.87763 -64.5,64.5c0,35.62237 28.87763,64.5 64.5,64.5c35.62237,0 64.5,-28.87763 64.5,-64.5c0,-35.62237 -28.87763,-64.5 -64.5,-64.5z" fill="#ffffff" stroke="none" stroke-width="1" stroke-linecap="butt"></path><path d="M86,33.59375c-28.94317,0 -52.40625,23.46308 -52.40625,52.40625c0,28.94317 23.46308,52.40625 52.40625,52.40625c28.94317,0 52.40625,-23.46308 52.40625,-52.40625c0,-28.94317 -23.46308,-52.40625 -52.40625,-52.40625z" fill="#2ecc71" stroke="none" stroke-width="1" stroke-linecap="butt"></path><path d="M86,21.5c-35.62237,0 -64.5,28.87763 -64.5,64.5c0,35.62237 28.87763,64.5 64.5,64.5c35.62237,0 64.5,-28.87763 64.5,-64.5c0,-35.62237 -28.87763,-64.5 -64.5,-64.5z" fill="none" stroke="#444b54" stroke-width="8.0625" stroke-linecap="butt"></path><path d="M56.4375,92.71875l18.20781,16.125l40.91719,-47.03125" fill="none" stroke="#ffffff" stroke-width="8.0625" stroke-linecap="round"></path></g></g></svg></div>
                  <h2 style='margin-top: 30px; font-size: 25px;'><b>Ödemeniz başarıyla alınmıştır.</b></h2> 
                  </center>
                  <div style=' text-align: justify; margin: 30px 25px; font-size: 20px'>Biletiniz biletlerim alanında QR kodu şeklindedir. Bu kodu okutarak etkinlik alanına giriş sağlayabilirsiniz.</div>
                  <center  style=' font-size: 20px'>İyi eğlenceler!</center>
                  </body>
                </html>
          `);
            }
            else {
                // handle/log error and send feedback to the user
                console.log(result);
                res.send(`
              <!DOCTYPE html>
              <html>
                <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1 ">
                </head> 
                <body>
                <center> 
                <div style="margin-top:60px">  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                width="256" height="256"
                viewBox="0 0 172 172"
                style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g><g><circle cx="256" cy="256" transform="scale(0.33594,0.33594)" r="245" fill="#ecf0f1"></circle><path d="M107.37785,86l18.09732,-18.09732c2.8349,-2.83486 4.42753,-6.67978 4.42753,-10.68891c0,-4.00913 -1.59263,-7.85405 -4.42753,-10.68891v0c-2.83487,-2.83489 -6.6798,-4.42752 -10.68893,-4.42752c-4.00913,0 -7.85405,1.59263 -10.68893,4.42752l-18.09732,18.09726l-18.09732,-18.09726c-2.83486,-2.8349 -6.67978,-4.42753 -10.68891,-4.42753c-4.00913,0 -7.85405,1.59263 -10.68891,4.42753v0c-2.83488,2.83487 -4.4275,6.67979 -4.4275,10.68891c0,4.00912 1.59262,7.85404 4.4275,10.68891l18.09726,18.09732l-18.09726,18.09729c-5.90332,5.90335 -5.90332,15.47454 0,21.37789v0c2.83487,2.83488 6.67979,4.4275 10.68891,4.4275c4.00912,0 7.85404,-1.59262 10.68891,-4.4275l18.09732,-18.09732l18.09732,18.09732c2.83488,2.83488 6.6798,4.4275 10.68893,4.4275c4.00913,0 7.85405,-1.59262 10.68893,-4.4275v0c2.83489,-2.83488 4.42752,-6.67981 4.42752,-10.68894c0,-4.00913 -1.59263,-7.85406 -4.42752,-10.68894z" fill="#f17b89"></path><path d="M88.96109,168.25228c-0.98094,0.03695 -1.96747,0.05487 -2.95961,0.05375c-45.4557,0 -82.30469,-36.84898 -82.30469,-82.30469c-0.02399,-14.74339 3.93257,-29.21982 11.45211,-41.90148c4.71324,51.74449 32.895,96.70629 73.81219,124.15242z" fill="#ecf0f1"></path><path d="M86.00148,170.32166c-28.77529,-0.01347 -55.55898,-14.69341 -71.05091,-38.94248c-15.49193,-24.24907 -17.55505,-54.72218 -5.47296,-80.83808c0.47246,-1.00316 1.66646,-1.43631 2.67222,-0.96942c1.00576,0.4669 1.44552,1.65848 0.9842,2.66681c-4.91741,10.57469 -7.45102,22.10078 -7.4216,33.76286c0,44.27159 36.01747,80.28906 80.28906,80.28906c44.27159,0 80.28906,-36.01747 80.28906,-80.28906c0,-44.27159 -36.01751,-80.28906 -80.28906,-80.28906c-24.87994,-0.07494 -48.37132,11.45831 -63.52746,31.18921c-0.68134,0.88035 -1.94735,1.04169 -2.8277,0.36034c-0.88035,-0.68134 -1.04169,-1.94735 -0.36034,-2.8277c7.75936,-10.00447 17.65318,-18.15162 28.96037,-23.84763c26.14237,-13.08094 57.1942,-11.6914 82.06369,3.67229c24.86949,15.36369 40.00942,42.51013 40.01176,71.74255c0,46.56882 -37.75149,84.32031 -84.32031,84.32031z" fill="#000000"></path><path d="M14.59622,47.05638c-0.7193,-0.00086 -1.38365,-0.38488 -1.74341,-1.00775c-0.35976,-0.62287 -0.36041,-1.39023 -0.00172,-2.01371c0.61184,-1.06294 1.24203,-2.10535 1.87305,-3.09872c0.59692,-0.93963 1.84253,-1.21746 2.78217,-0.62054c0.93963,0.59692 1.21746,1.84253 0.62054,2.78217c-0.59972,0.94398 -1.1993,1.93604 -1.78188,2.94812c-0.35989,0.62569 -1.02694,1.01112 -1.74876,1.01043z" fill="#000000"></path><path d="M114.78611,131.91029c-4.54362,0.00791 -8.90311,-1.79501 -12.11391,-5.00987l-16.67221,-16.67204l-16.67207,16.67201c-6.69231,6.67998 -17.53116,6.67497 -24.21728,-0.0112c-6.68612,-6.68617 -6.69106,-17.52502 -0.01104,-24.21728l16.67187,-16.67191l-16.67187,-16.67201c-4.33463,-4.32664 -6.02994,-10.6381 -4.44665,-16.55435c1.58329,-5.91625 6.20434,-10.53734 12.12059,-12.12067c5.91624,-1.58333 12.22771,0.11194 16.55438,4.44654l16.67207,16.67204l16.67204,-16.67194c6.69051,-6.69047 17.53794,-6.69044 24.22842,0.00007c6.69047,6.69051 6.69044,17.53794 -0.00007,24.22842l-16.67207,16.67191l16.67207,16.67191c4.90225,4.89766 6.36954,12.26706 3.71707,18.66891c-2.65246,6.40184 -8.90176,10.57405 -15.83135,10.56945zM86,105.36223c0.53471,-0.0007 1.04764,0.21176 1.42525,0.59034l18.09732,18.09732c3.30787,3.31822 8.13599,4.61729 12.66233,3.40698c4.52634,-1.21032 8.06174,-4.74575 9.27202,-9.2721c1.21028,-4.52635 -0.08884,-9.35446 -3.40709,-12.6623l-18.09732,-18.09715c-0.378,-0.378 -0.59037,-0.89069 -0.59037,-1.42527c0,-0.53458 0.21236,-1.04726 0.59037,-1.42527l18.09732,-18.09732c3.31825,-3.30784 4.61737,-8.13595 3.40709,-12.6623c-1.21028,-4.52635 -4.74568,-8.06178 -9.27202,-9.2721c-4.52634,-1.21032 -9.35446,0.08875 -12.66233,3.40698l-18.09732,18.09732c-0.7872,0.78704 -2.06333,0.78704 -2.85053,0l-18.09732,-18.09732c-3.30787,-3.31822 -8.13599,-4.61729 -12.66233,-3.40698c-4.52634,1.21032 -8.06174,4.74575 -9.27202,9.2721c-1.21028,4.52635 0.08884,9.35446 3.40709,12.6623l18.09715,18.09732c0.378,0.378 0.59037,0.89069 0.59037,1.42527c0,0.53458 -0.21236,1.04726 -0.59037,1.42527l-18.09715,18.09715c-3.31825,3.30784 -4.61737,8.13595 -3.40709,12.6623c1.21028,4.52635 4.74568,8.06178 9.27202,9.2721c4.52634,1.21032 9.35446,-0.08875 12.66233,-3.40698l18.09732,-18.09732c0.37762,-0.37858 0.89056,-0.59104 1.42528,-0.59034z" fill="#000000"></path></g></g></g></svg></div>
                <h2 style='margin-top: 30px; font-size: 25px;'><b>Ödemede bir hata oluştu!</b></h2>
                </body>
              </html>
        `);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.iyzico = iyzico;
//Sending the checkout form
const form = async (req, res) => {
    try {
        const { body: { buyerIp, buyerCity, buyerAdress, buyerIdentityNumber, buyerMail, buyerName, buyerSurname, buyerPhoneNumber, price, paidPrice, chosenTicket, }, params: { userId, eventId }, } = req;
        const event = await (await firebase_1.db.collection('events').doc(eventId).get()).data();
        const eventPrice = event.biletler[chosenTicket].split(':')[1];
        const ticketName = event.biletler[chosenTicket].split(':')[0];
        var request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: '14789632',
            price: price,
            paidPrice: paidPrice,
            currency: Iyzipay.CURRENCY.TRY,
            callbackUrl: `https://europe-west1-biletixclone.cloudfunctions.net/app/payment/make-payment`,
            buyer: {
                id: userId,
                name: buyerName,
                surname: buyerSurname,
                gsmNumber: buyerPhoneNumber,
                email: buyerMail,
                identityNumber: buyerIdentityNumber,
                registrationAddress: buyerAdress,
                ip: buyerIp,
                city: buyerCity,
                country: 'Turkey',
            },
            billingAddress: {
                contactName: `${buyerName} ${buyerSurname}`,
                city: buyerCity,
                country: 'Turkey',
                address: buyerAdress,
            },
            basketItems: [
                {
                    id: `${eventId}-${userId}-${ticketName}`,
                    name: event.title,
                    category1: 'Etkinlik',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: eventPrice,
                },
            ],
        };
        await iyzico_1.iyzipay.checkoutFormInitialize.create(request, async (err, result) => {
            if (result.status === 'success') {
                await res.send((await result.checkoutFormContent) +
                    '<div id="iyzipay-checkout-form" class="responsive"></div>');
            }
            if (err) {
                console.log(err);
            }
        });
    }
    catch (err) {
        console.log('error1', err);
        console.log('req.body', req.body);
    }
};
exports.form = form;
//# sourceMappingURL=paymentController.js.map