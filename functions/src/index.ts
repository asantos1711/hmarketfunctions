/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";

// import { onRequest } from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export { onRequest } from "firebase-functions/v2/https";
// export { puppeteer } from "puppeteer";
import puppeteer from "puppeteer";

function delay(time: number | undefined) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export const getFromChedraui = onRequest(
  { memory: "1GiB", timeoutSeconds: 120 }, // config v2
  async (req, res) => {
    try {
      const browser = await puppeteer.launch({ headless: "shell" });
      const page = await browser.newPage();
      const search = encodeURI(req.body.search);

      await page.goto(
        `https://www.chedraui.com.mx/${search}?_q=${search}&map=ft`
      );
      await delay(1000);
      let result = await page.evaluate(() => {
        const items = document.querySelectorAll(
          ".chedrauimx-search-result-3-x-galleryItem"
        );
        let data = [...items].map((product) => {
          let nombre = product.querySelector(
            ".vtex-product-summary-2-x-skuName--global__card--name"
          )?.innerHTML;
          let precioLista = product.querySelector(
            ".chedrauimx-products-simulator-0-x-simulatedSellingPrice"
          )?.innerHTML;
          let precioConDescuento = product.querySelector(
            ".chedrauimx-products-simulator-0-x-simulatedPriceWithDiscount"
          )?.innerHTML;
          let precioAnterior = product.querySelector(
            ".chedrauimx-products-simulator-0-x-simulatedListPrice"
          )?.innerHTML;
          let presentacion = product.querySelector(
            ".chedrauimx-frontend-applications-5-x-shelfProductSpecText"
          )?.innerHTML;
          let agotado =
            product.querySelector(".c-on-disabled")?.innerHTML != undefined;
          let img = product.querySelector("img")?.src;
          return {
            nombre,
            precioLista,
            precioConDescuento,
            precioAnterior,
            presentacion,
            agotado,
            img,
          };
        });
        return data;
      });

      await browser.close();

      res.status(200).json({ ok: true, msg: "Abierto con éxito", result });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ ok: false, error: err.message });
    }
  }
);
export const getFromSoriana = onRequest(
  { memory: "1GiB", timeoutSeconds: 120 }, // config v2
  async (req, res) => {
    try {
      const browser = await puppeteer.launch({ headless: "shell" });
      const page = await browser.newPage();
      const search = req.body.search.replace(" ","+");

      await page.goto(
        `https://www.soriana.com/buscar?q=${search}&search-button=`
      );
      await delay(10000);
      let result = await page.evaluate(() => {
        const items = document.querySelectorAll(
          ".list-item-product"
        );
        let data = [...items].map((product) => {
          let nombre = product.querySelector(
            ".ellipsis-product-name"
          )?.innerHTML;
          let precioLista = product.querySelector(
            ".plp-price"
          )?.querySelector("span")?.innerText;
          let precioConDescuento = product.querySelector(
            ".price-pdp"
          )?.querySelector("span")?.innerText;
          let precioAnterior = product.querySelector(
            ".text-truncate"
          )?.innerHTML?.trim();
        //   let presentacion = product.querySelector(
        //     ".chedrauimx-frontend-applications-5-x-shelfProductSpecText"
        //   )?.innerHTML;
        //   let agotado =
        //     product.querySelector(".c-on-disabled")?.innerHTML != undefined;
          let img = !product.querySelector("img")?.src.includes("data:image")?product.querySelector("img")?.src:undefined;
          return {
            nombre,
            precioLista,
            precioConDescuento,
            precioAnterior,
            img,
          };
        });
        return data;
      });

      await browser.close();

      res.status(200).json({ ok: true, msg: "Abierto con éxito", result });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ ok: false, error: err.message });
    }
  }
);
