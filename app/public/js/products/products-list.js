// const tokenID = localStorage.getItem("tokenPT");

var filter = "";

const options = { minimumFractionDigits: 3, maximumFractionDigits: 3 };
const formatNumber = new Intl.NumberFormat("pt-BR", options);

function formatarNumber(valor) {
   if (valor == 0) return "0,000";
   let peso = parseFloat(valor.replace(",", "."));
   return formatNumber.format(valor);
}

const fetchProducts = async () => {
   const response = await fetch("/produto_All", {
      method: "GET",
      headers: {
         "content-type": "application/json",
         // Authorization: `Bearer ${tokenID}`,
      },
   });

   const result = await response.json();

   if (!response.ok) {
      notie.alert({ type: "error", text: "Realize login para continuar!" });
      setTimeout(() => {
         window.location.href = "index.html";
      }, 1000);
   }

   await initTable(result);
   await addFiltersTable();
   // createToolbar();
};

async function initTable(products) {
   $("#table")
      .bootstrapTable("destroy")
      .bootstrapTable({
         locale: "pt-br",
         resizable: "true",
         data: products.map(function (rowData) {
            return {
               id: rowData.id,
               commodity: rowData.commodity,
               categoria: rowData.categoria,
               categoria_planning: rowData.categoria_planning,
               categoria_gpc: rowData.categoria_gpc,
               product_group: rowData.product_group,
               marca_gpc: rowData.marca_gpc,
               cod_produto: rowData.cod_produto,
               produto: rowData.produto,
               vira_custo: rowData.vira_custo,
               peso_liquido_caixa: formatarNumber(rowData.peso_liquido_caixa),
               unidades_caixa: rowData.unidades_caixa,
               peso_liquido_unitario: formatarNumber(rowData.peso_liquido_unitario),
            };
         }),
         columns: [
            [
               {
                  field: "id",
                  visible: false,
               },
               // {
               //    field: "",
               //    checkbox: true,
               //    align: "center",
               //    valign: "middle",
               // },
               {
                  field: "operate",
                  title: "Ações",
                  align: "center",
                  class: "btn-actions-products",
                  // clickToSelect: false,
                  events: window.operateEvents,
                  formatter: operateFormatter,
               },

               {
                  title: "Commodity",
                  field: "commodity",
                  align: "left",
                  sortable: true,
                  valign: "middle",
                  width: "40",
                  visible: true,
               },
               {
                  title: "Categoria",
                  field: "categoria",
                  align: "left",
                  sortable: true,
                  valign: "middle",
                  visible: true,
                  class: "categoria",
               },
               {
                  title: "Categoria Planning",
                  field: "categoria_planning",
                  align: "left",
                  sortable: true,
                  valign: "middle",
                  visible: false,
                  class: "categoria",
               },
               {
                  title: "Categoria GPC",
                  field: "categoria_gpc",
                  align: "left",
                  sortable: true,
                  valign: "middle",
                  visible: false,
                  class: "categoria",
               },
               {
                  title: "Grupo de Produtos",
                  field: "product_group",
                  align: "left",
                  sortable: false,
                  valign: "middle",
                  visible: true,
                  class: "product-group",
               },

               {
                  title: "Marca",
                  field: "marca_gpc",
                  align: "left",
                  sortable: true,
                  valign: "middle",
                  visible: false,
                  class: "categoria",
               },

               {
                  title: "Cod. Produto",
                  field: "cod_produto",
                  align: "center",
                  sortable: false,
                  valign: "middle",
                  width: "30",
                  visible: true,
               },

               {
                  title: "Produto",
                  field: "produto",
                  align: "left",
                  sortable: true,
                  valign: "middle",
                  visible: true,
                  class: "produto",
               },

               {
                  title: "Peso Líq. Caixa (kg)",
                  field: "peso_liquido_caixa",
                  valign: "middle",
                  width: "40",
                  visible: true,
                  class: "peso-produto",
               },
               {
                  title: "Unidades Caixa",
                  field: "unidades_caixa",
                  class: "peso-produto",
                  valign: "middle",
                  width: "30",
                  visible: true,
               },
               {
                  title: "Peso Líq. Unitário (kg)",
                  field: "peso_liquido_unitario",
                  valign: "middle",
                  width: "40",
                  visible: true,
                  class: "peso-produto",
               },
            ],
         ],
      });
}

function operateFormatter(value, row, index) {
   let edit_data = [`<a class="edit" href="./regimes.html?regimeID=${Number(row.id)}" title="Alterar"><i class="fa fa-edit"></i></a>`].join("");
   let delete_data = ['<a class="remove" href="javascript:void(0)" title="Excluir">', '<i class="fa fa-trash"></i>', "</a>"].join("");
   return edit_data + delete_data;
}

window.operateEvents = {
   "click .remove": function (e, value, row, index) {
      bootbox.confirm({
         title: "Aviso",
         message: "Deseja realmente excluir?",
         // size: "small",
         buttons: {
            cancel: {
               label: "Cancelar",
               className: "btn-secondary bootbox-accept",
            },
            confirm: {
               label: "Excluir",
               className: "btn-danger",
            },
         },
         callback: async function (excluir) {
            if (excluir) {
               try {
                  $("#table").bootstrapTable("remove", {
                     field: "id",
                     values: [row.id],
                  });

                  //let distributor = new Distributor(row.id);

                  // código faltante

                  //distributor.deleteDistributor(row.id);

                  alertMessage("Registro excluído com sucesso!");
               } catch (error) {
                  console.error("Erro ao excluir registro:", error);
               }
            }
         },
      });
   },
};

function detailFormatter(index, row) {
   var html = [];
   var descDetalhe;

   $.each(row, function (key, value) {
      if (key == "categoria_planning" || key == "categoria_gpc" || key == "product_group" || key == "marca_gpc") {
         if (key == "categoria_planning") {
            descDetalhe = "Categoria Planning";
         }
         if (key == "categoria_gpc") {
            descDetalhe = "Categoria GPC";
         }

         if (key == "product_group") {
            descDetalhe = "Grupo de Produtos";
         }

         if (key == "marca_gpc") {
            descDetalhe = "Marga GPC";
         }

         html.push("<p class='mb-0'><b>" + descDetalhe + ":</b> " + value + "</p>");
      }
   });
   // $.each(row, function (key, value) {
   //    if (!key == "" && key != "id") {
   //       html.push("<p><b>" + key + ":</b> " + value + "</p>");
   //    }
   // });

   return html.join("");
}

function alertMessage(alert_mensagem) {
   document.querySelector("#confirm-confirm").computedStyleMap.display = "none";
   document.getElementById("modal-confirm-message").innerHTML = alert_mensagem;
   document.querySelector("#cancel-confirm").innerHTML = "Fechar";
   document.querySelector(".modal-title").innerHTML = "Aviso";
   $("#tipoMsg").attr("class", "modal-header text-secondary");
   $("#cancel-confirm").attr("class", "btn btn-secondary");

   // Pop up Mensagem Sucesso
   $("#modal-confirm").modal("show");
}

fetchProducts();

// Capturando o evento de clique no botão "refresh"
$("#table-products").on("click", 'button[name="refresh"]', () => {
   fetchProducts();
});

async function addFiltersTable() {
   const filterProduto = document.querySelector(".filtros-products");

   filterProduto.innerHTML = `
   <div class="d-flex flex-column fixed-table-body mt-5">
   <div class="d-flex row mx-0">
   <h6 class="h6-filtros mb-3">Filtros</h6><i id="showFilter" class="fa fa-plus ml-2" aria-hidden="true"></i>
   </div>
   <div id="filters" class="d-none flex-row col-md-12 px-0">
   <div class="d-flex flex-column col-md-1 px-0">
   <label class="label-filtros mb-1" for="filterCommodity">BU</label>
   <select class="filter-commodity" name="filterCommodity" id="filterCommodity">
   <option value="0" selected></option>
   </select>
   </div>
   <div class="d-flex flex-column col-md-3 px-0 mx-2">
   <label class="label-filtros mb-1" for="filterCategoria">Categoria</label>
   <select class="filter-categoria" name="filterCategoria" id="filterCategoria">
   <option value="0" selected></option>
   </select>
   </div>
   <div class="d-flex flex-column col-md-3 px-0">
   <label class="label-filtros mb-1" for="filterProduto">Produto</label>
   <select class="filter-produto" name="filterProduto" id="filterProduto">
   <option value="0" selected></option>
   </select>
   </div>
   <div class="d-flex mx-1 align-items-end">
   <button class="btn btn-filter-header" onclick="filtrarProduto()") type="button" id="filtrar">OK</button>
   </div>
   </div>
   </div>`;

   await selectProduto();
   await selectCategoria();
   await selectCommodity();

   const filters = document.getElementById("filters");

   const showFilter = document.getElementById("showFilter");
   showFilter.addEventListener("click", () => {
      filters.classList.toggle("d-flex");
   });
}

const selectProduto = async () => {
   const resp = await fetch("/produto_All", {
      method: "GET",
      headers: {
         "content-type": "application/json",
         // Authorization: `Bearer ${tokenID}`,
      },
   });

   const res = await resp.json();

   const filterProduto = document.getElementById("filterProduto");

   res.forEach(function (row) {
      var option = document.createElement("option");
      option.setAttribute("value", row.id);
      option.textContent = row.produto;
      filterProduto.appendChild(option);
   });

   $("select").select2({
      placeholder: "",
      selectOnClose: true,
   });

   $(document).on("select2:open", () => {
      document.querySelector(".select2-container--open .select2-search__field").focus();
   });
};

const selectCategoria = async () => {
   const resp = await fetch("/category_All", {
      method: "GET",
      headers: {
         "content-type": "application/json",
         // Authorization: `Bearer ${tokenID}`,
      },
   });

   const res = await resp.json();

   const filterCategoria = document.getElementById("filterCategoria");

   res.forEach(function (row) {
      var option = document.createElement("option");
      option.setAttribute("value", row.id);
      option.textContent = row.categoria;
      filterCategoria.appendChild(option);
   });

   $("select").select2({
      placeholder: "",
      selectOnClose: true,
   });

   $(document).on("select2:open", () => {
      document.querySelector(".select2-container--open .select2-search__field").focus();
   });
};

const selectCommodity = async () => {
   const resp = await fetch("/commodity_All", {
      method: "GET",
      headers: {
         "content-type": "application/json",
         // Authorization: `Bearer ${tokenID}`,
      },
   });

   const res = await resp.json();

   const filterCommodity = document.getElementById("filterCommodity");

   res.forEach(function (row) {
      var option = document.createElement("option");
      option.setAttribute("value", row.id);
      option.textContent = row.commodity;
      filterCommodity.appendChild(option);
   });

   $("select").select2({
      placeholder: "",
      selectOnClose: true,
   });

   $(document).on("select2:open", () => {
      document.querySelector(".select2-container--open .select2-search__field").focus();
   });
};

function filtrarProduto() {
   const filterCommodity = document.getElementById("select2-filterCommodity-container");
   const filterCategory = document.getElementById("select2-filterCategoria-container");
   const filterProduct = document.getElementById("select2-filterProduto-container");

   let selCommodity = filterCommodity.getAttribute("title");
   let selCategoria = filterCategory.getAttribute("title");
   let selProduto = filterProduct.getAttribute("title");

   let filters = {};

   if (selCommodity !== "" && selCommodity !== null) {
      filters.commodity = [selCommodity];
   }

   if (selCategoria !== "" && selCategoria !== null) {
      filters.categoria = [selCategoria];
   }

   if (selProduto !== "" && selProduto !== null) {
      filters.produto = [selProduto];
   }

   $("#table").bootstrapTable("filterBy", filters);
}

// function createToolbar() {
//    var toolbar = document.querySelector(".fixed-table-toolbar");
//    var toolbar_actions = document.createElement("div");
//    toolbar_actions.classList.add("toolbar-actions");

//    toolbar.appendChild(toolbar_actions);

//    toolbar_actions.innerHTML = `
//    <button id="new-product" class="add-product" data-dismiss="modal"><i class="fa fa-plus" aria-hidden="true"></i>Adicionar</button>`;

//    // var actions_buttons = document.createElement("button");
//    // actions_buttons.classList.add("add-regime");
//    // actions_buttons.textContent = "Adicionar";

//    // toolbar_actions.appendChild(actions_buttons);

//    var addProduct = document.getElementById("new-product");

//    addProduct.addEventListener("click", () => {
//       window.location.href = "./product.html";
//    });
// }
