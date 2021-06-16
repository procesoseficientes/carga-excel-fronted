window.onload=function(){

  const dict = { 
    "CODIGO SKU" : "codeSKU" , 
    "UNIDADES/FARDOS" : "packUnit", 
    "VENTA MINIMA": "lowLimit",
    "VENTA MAXIMA": "highLimit",
    "DESCUENTO": "discount",
    "TIPO DE DESCUENTO": "discountType",
    "CODIGO FAMILIA SKU": "codeFamilySku",
    "CODIGO SKU BONIFICADO":"codeSKUBonus",
    "UNIDADES/FARDOS BONIFIACION":"packUnitBonus",
    "CANTIDAD BONIFICADA":"bonusQTY",
    "MULTIPLO":"multiple"
  };

//inicializar tabla
  let descuentos = $('.mydatatable').DataTable({
    dataSrc:"",
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json" //Archivo de idioma
    }
  });

  let promoItems;
  let route = ""

//Estilo y funcionamiento de boton de cargar archivo
  function bs_input_file() {
    $(".input-file").before(
      function () {
        if (!$(this).prev().hasClass('input-ghost')) {
          let element = $("<input required disabled id='load-csv' type='file' accept='.csv' class='input-ghost' style='visibility:hidden; height:0'>");
          element.attr("name", $(this).attr("name"));
          element.change(function (e) {
            element.next(element).find('input').val((element.val()).split('\\').pop());
            if (!e.target.files.length) {
              console.log("Please choose a csv file...");
              return
            }else{
              console.log("archivo");
              const file = e.target.files[0];
              Papa.parse(file, { //origin del archivo
                  download: true,
                  header: true,
                  transformHeader: function(h){
                    console.log(`${h} : ${dict[h]}`)
                    return dict[h]
                  },
                  complete: function(e) {
                      console.log(e.data); //imprimir array con los datos en la consola
                      promoItems = e.data.slice(0,-1);
                      console.log(promoItems)
                      const result = e.data.slice(0,-1).map(a => Object.values(a));
                      console.log(result);
                      descuentos.rows.add(result)  
                      descuentos.draw()                    
                      // descuentos.clear().draw(); //limpiar la tabla   
                      // descuentos.rows.add(result).draw();  //mostrar datos en la tabla
                  }
              });
              $("#btnSend").prop("disabled", false);
              return
            }
          });
          $(this).find("button.btn-choose").click(function () {
            element.click();
          });
          $(this).find("button.btn-reset").click(function () {
            element.val(null);
            $(this).parents(".input-file").find('input').val('');
          });
          $(this).find('input').css("cursor", "pointer");
          $(this).find('input').mousedown(function () {
            $(this).parents('.input-file').prev().click();
            return false;
          });
          return element;
        }
      }
    );
  }

  $(function () {
    bs_input_file();
  });

  $("#promoTypeSelect").change(function(){
    let html = ``
    let selectedPromoType = $(this).children("option:selected").val();
    switch(selectedPromoType) {
      case "DISCOUNT_BY_GENERAL_AMOUNT":
        route = "discountByGeneralAmount"
        html = `
        <th>Venta Minima</th>
        <th>Venta Maxima</th>
        <th>Descuento</th>
        `
        break;
      case "DISCOUNT_BY_GENERAL_AMOUNT_AND_FAMILY":
        route = "discountByFamily"
        html = `
        <th>Codigo Familia SKU</th>
        <th>Limite inferior</th>
        <th>Limite superior</th>
        <th>Descuento</th>
        <th>Tipo de Descuento</th>
        `
        break;
      case "DISCOUNT_BY_SCALE":
        route = "discountByScale"
        html = `
        <th>Codigo SKU</th>
        <th>Unidad de Paquete</th>
        <th>Limite inferior</th>
        <th>Limite superior</th>
        <th>Descuento</th>
        <th>Tipo de Descuento</th>
        `
        break;
      case "BONUS_BY_SCALE":
        route = "bonusByScale"
        html = `
        <th>Codigo SKU</th>
        <th>Unidad de Paquete</th>
        <th>Limite inferior</th>
        <th>Limite superior</th>
        <th>Codigo SKU Bonificado</th>
        <th>Unidad de Paquete Bonificado</th>
        <th>Cantidad Bonificada</th>
        `
        break;
      case "BONUS_BY_MULTIPLE":
        route = "bonusByMultiple"
        html = `
        <th>Codigo SKU</th>
        <th>Unidad de Paquete</th>
        <th>Multiplo</th>
        <th>Codigo SKU Bonificado</th>
        <th>Unidad de Paquete Bonificado</th>
        <th>Cantidad Bonificada</th>
        `
        break;
      case "BONUS_BY_GENERAL_AMOUNT":
        route = "bonusByMultiple"
        html = `
        <th>Venta Minima</th>
        <th>Venta Maxima</th>
        <th>Codigo SKU Bonificado</th>
        <th>Unidad de Paquete Bonificado</th>
        <th>Cantidad Bonificada</th>
        `
        break;  
    }
    $("#path-display").prop("disabled", false);
    $("#load-csv").prop("disabled", false);
    $("#btnSend").prop("disabled", true);
    $("#path-display").val('Escoger archivo...')
    $("#load-csv").val('');
    descuentos.clear().draw();
    $("#tableHeader").html(html);
    $("#tableFooter").html(html);
  });

  $("form#data").submit(function(e) {
    e.preventDefault();

    $("#btnSend").prop("disabled", true);
    // add spinner to button
    $("#btnSend").html(
      `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
    );

    let formData = new FormData(this);
    formData.append('promoItems', JSON.stringify(promoItems))
    console.log(JSON.stringify(promoItems))
    
    console.log(formData.get("promoType"))

    $.ajax({
        url: `http://localhost:3000/discounts/${route}`,
        type: 'POST',
        data: formData,
        success: function (data, textStatus) {
          $("#btnSend").prop("disabled", false);
          $("#btnSend").html('Submit');
          $("#modalTitle").html('Operación Exitosa!')
          $("#modalText").html(`Se insertaron ${data.length} filas a la promoción ${data[0].PROMO_ID}`)
          $("#modalFooter").html("<a data-dismiss='modal' class='btn btn-success'>Ok</a>")
          $("#myModal").modal('show')
        },
        error: function(xhr, textStatus){
          $("#btnSend").prop("disabled", false);
          $("#btnSend").html('Submit');
          $("#modalTitle").html('Ocurrió un error')
          $("#modalText").html(`${xhr.responseText}`)
          $("#modalFooter").html("<a data-dismiss='modal' class='btn btn-danger'>Cancel</a>")
          $("#myModal").modal('show')
        },
        cache: false,
        contentType: false,
        processData: false,
    });
  });

}