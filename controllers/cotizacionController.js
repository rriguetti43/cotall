const Cotizacion = require('../models/cotizacionModel');
const CotizacionDet = require('../models/cotizacionDetModel');
const Tablas = require('../models/tablasModel');
const Usuario = require('../models/userModel');
//const express = require('express');
const path = require('path');  // Para manejar las rutas de archivos
const ejs = require('ejs');
//const puppeteer = require('puppeteer');
const pdf = require('html-pdf');
const fs = require('fs');

exports.getAllCotizaciones = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  Cotizacion.getAll(res.locals.idcia, (err, cotizaciones) => {
    if (err) {
      return res.status(500).send("Error al obtener cotizaciones");
    }

    res.render("cotizaciones/index", { cotizaciones });
  });
};

exports.creaCotizacionForm = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  Cotizacion.buscaAllCli(res.locals.idcia,(err, clientes) => {
    if (err) {
      return res.status(500).send("Error al obtener Clientes");
    }
    Tablas.Monedas((err, monedas) => {
      if (err) {
        return res.status(500).send("Error al obtener Monedas");
      }
      Tablas.Formapago((err, formapagos) => {
        if (err) {
          return res.status(500).send("Error al obtener Forma Pagos");
        }
        Tablas.Formaentrega((err, formaentregas) => {
          if (err) {
            return res.status(500).send("Error al obtener Forma Entrega");
          }
          Cotizacion.buscaAllProd(res.locals.idcia,(err, productos) => {
            if (err) {
              return res.status(500).send("Error al obtener productos individual");
            }
            Tablas.umedidas((err, medidas) => {
              if (err) {
                return res.status(500).send("Error al obtener Unidad de medida");
              }
              Usuario.getNombreUsuario(req.session.user,(err, asesor) => {
                if (err) {
                  return res.status(500).send("Error al obtener asesor comercial");
                }
                console.log(JSON.stringify(asesor, null, 2));

                res.render("cotizaciones/createCot", { clientes, monedas, formapagos, formaentregas, productos, medidas, idcia: res.locals.idcia, asesor });
              })
            });
          });
        });
      });
    });
  });

  //res.render('cotizaciones/createCot', { title: 'Crear Cotización' });
};

exports.crearCotizacion = (req, res) => {

  let cotizacab;
  const { cotizacion, cotizaciodet } = req.body;

  if (!req.session.user) {
    return res.redirect("/");
  }
  // Aquí puedes guardar la cotización en la base de datos o procesarla como desees
  //console.log("cotizacion:", cotizacion);
  //console.log("cotizaciodet:", cotizaciodet);

  Cotizacion.obtienecontador(1, (err, result) => {
    //console.log(result);
    let numero = result;
    let numeroFormateado = numero.toString().padStart(8, '0');
    //console.log(numeroFormateado);
    const numcot = "CT" + numeroFormateado
    //console.log(numcot);
    cotizacion.numcot = numcot;
    cotizacion.iduser = res.locals.iduser;
    console.log("cotizacion ACT:", cotizacion);
    console.log("iduser:", res.locals.iduser);
    
    Cotizacion.crearCotizacion(cotizacion, (err, results) => {
      if (err) {
        console.log(err)
        return err; //res.status(500).send('Error al crear la cotización');
      }
      else {
        // Obtener el id de la cotización recién creada
        const idCotizacion = results.insertId;
        const productos = req.body.cotizaciodet; // Supongamos que `productos` es un array con el detalle
        productos.forEach(producto => {
          const detalleCotizacion = {
            idcot: idCotizacion,
            idprod: producto.idprod,
            cantidad: producto.cantidad,
            idumd: producto.idumd,
            preciounit: producto.preciounit,
            subtotal: producto.subtotal,
            impuesto: 0,
            total: 0
          };
          // Crear el detalle de la cotización
          CotizacionDet.crearDetalleCotizacion(detalleCotizacion, (err, result) => {
            if (err) {
              console.log(err)
              return err;
            }

          });
        });
        console.log(idCotizacion);
      }
    });
    //
    res.send("ok");
    //res.redirect('https://www.nueva-url.com');

  });
};

exports.obtieneProductoID = (req, res) => {
  const { id } = req.params;

  Cotizacion.obtieneProdId(id, (err, producto) => {
    //console.log(Object.keys(producto).length);
    if (err) {
      return res.status(500).send("Error al obtener producto");
    }
    else {
      if (Object.keys(producto).length > 0) {
        res.json(producto);  // Devuelve el primer resultado como JSON
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    }
  });
}

exports.generaPDFprevia = (req, res) => {
  res.render("cotizaciones/cotizacionPDF");
}

exports.generaPDFDownload = async (req, res) => {
  const { id } = req.params;
  try {

    Cotizacion.obtieneCotIdPDF(id, (err, data) => {
      //console.log(Object.keys(producto).length);
      if (err) {
        return res.status(500).send("Error al obtener cotizacion");
      }
      else {
        if (Object.keys(data).length > 0) {

          Cotizacion.obtieneCotIdPDFDetalle(id, (err, datadet) => {
            if (err) {
              return res.status(500).send("Error al obtener el detalle");
            }
            // Ruta a la plantilla EJS
            const templatePath = path.join(__dirname, '../views/cotizaciones/', 'cotizacionPlantilla.ejs');
            console.log(data);
            console.log(datadet);
            // Renderizar el archivo EJS con los datos
            ejs.renderFile(templatePath, { data, datadet }, (err, html) => {
              if (err) {
                console.error('Error al renderizar la plantilla EJS:', err);
                return res.status(500).send('Error al generar el HTML');
              }

              //console.log(html);

              // Opciones de configuración para el PDF
              const options = {
                format: 'A4',
                //border: "10mm"
                //base: 'file://' + path.join(__dirname, 'theme') + '/'
                //phantomPath: path.join(__dirname, '../node_modules', 'phantomjs-prebuilt', 'bin', 'phantomjs')
                //base: 'file:///D:/Desarrollo/Proyectos/Express_JS/Clientes/Promixar',  // Ruta base para tus archivos CSS, imágenes, etc.
              };

              // Crear el PDF a partir del HTML generado
              pdf.create(html, options).toFile('./output.pdf', (err, result) => {
                if (err) {
                  console.error('Error al generar el PDF:', err);
                  return res.status(500).send('Error al generar el PDF');
                }

                // Responder con el archivo PDF generado
                res.contentType("application/pdf");
                res.sendFile(result.filename);
              });
            });
          })
        } else {
          res.status(404).json({ error: 'data de cotizacion no encontrado' });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al generar el PDF');
  }
}



// // Datos dinámicos para pasar a la plantilla
// const data = {
//   nombre: "Juan Pérez",
//   producto: "Camiseta",
//   precio: 19.99,
//   cantidad: 3
// };
// // Ruta al archivo de la plantilla EJS
// const filePath = path.join(__dirname, '../views/cotizaciones/','cotizacionPDF.ejs');
// console.log(filePath);
// // Renderizar la plantilla EJS con los datos
// const htmlContent = await ejs.renderFile(filePath, data);

// // Iniciar Puppeteer
// const browser = await puppeteer.launch();
// const page = await browser.newPage();

// // Establecer el contenido HTML de la página con el HTML renderizado
// await page.setContent(htmlContent);

// // Generar el PDF
// const pdfBuffer = await page.pdf({
//   format: 'A4',
//   printBackground: true  // Imprimir fondos (si los hay)
// });

// // Cerrar Puppeteer
// await browser.close();

// // Enviar el PDF como respuesta
// res.contentType("application/pdf");
// res.send(pdfBuffer);