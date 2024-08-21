document.getElementById('btnMenu').addEventListener('click', function() {
    document.getElementById('menuSection').style.display = 'block';
    document.getElementById('registrarSection').style.display = 'none';
    document.getElementById('listarSection').style.display = 'none';
    document.getElementById('resumenSection').style.display = 'none';
});

document.getElementById('btnRegistrar').addEventListener('click', function() {
    document.getElementById('menuSection').style.display = 'none';
    document.getElementById('registrarSection').style.display = 'block';
    document.getElementById('listarSection').style.display = 'none';
    document.getElementById('resumenSection').style.display = 'none';
});

document.getElementById('btnListar').addEventListener('click', function() {
    document.getElementById('menuSection').style.display = 'none';
    document.getElementById('registrarSection').style.display = 'none';
    document.getElementById('listarSection').style.display = 'block';
    document.getElementById('resumenSection').style.display = 'none';
});

document.getElementById('btnResumen').addEventListener('click', function() {
    document.getElementById('menuSection').style.display = 'none';
    document.getElementById('registrarSection').style.display = 'none';
    document.getElementById('listarSection').style.display = 'none';
    document.getElementById('resumenSection').style.display = 'block';
});

document.getElementById("product").addEventListener("change", function() {
    var selectedOption = this.options[this.selectedIndex];
    var productCost = selectedOption.value;
    document.getElementById("productCost").textContent = `S/${productCost}`;
});

document.getElementById("productForm").addEventListener("submit", function(event) {
    event.preventDefault();
    registrarProducto();
    limpiarFormulario();
});

function registrarProducto() {
    var productName = document.getElementById("product").selectedOptions[0].getAttribute("data-name");
    var productQuantity = document.getElementById("quantity").value;
    var paymentType = document.getElementById("paymentType").value;
    var productCost = parseFloat(document.getElementById("productCost").textContent.replace('S/', ''));
    var productTotal = productQuantity * productCost;

    // Crear una nueva fila en la tabla
    var tableBody = document.getElementById("recordsList");
    var row = document.createElement("tr");
    row.innerHTML = `
        <td>${productQuantity}</td>
        <td>${productName}</td>
        <td>S/${productCost.toFixed(2)}</td>
        <td>${paymentType}</td>
    `;

    tableBody.appendChild(row);

    // Actualizar el resumen
    actualizarResumen(productTotal, paymentType);
}

function limpiarFormulario() {
    document.getElementById("product").selectedIndex = 0;
    document.getElementById("quantity").value = "";
    document.getElementById("paymentType").selectedIndex = 0;
    document.getElementById("productCost").textContent = "S/0.00";
}

function actualizarResumen(monto, tipoPago) {
    var subtotalYape = parseFloat(document.getElementById("subtotalYape").textContent.replace('S/', ''));
    var subtotalEfectivo = parseFloat(document.getElementById("subtotalEfectivo").textContent.replace('S/', ''));
    var totalYape = parseFloat(document.getElementById("totalYape").textContent);
    var totalEfectivo = parseFloat(document.getElementById("totalEfectivo").textContent);

    if (tipoPago === "yape") {
        subtotalYape += monto;
        totalYape += 1;
        document.getElementById("subtotalYape").textContent = `S/${subtotalYape.toFixed(2)}`;
        document.getElementById("totalYape").textContent = totalYape.toFixed(0);
    } else {
        subtotalEfectivo += monto;
        totalEfectivo += 1;
        document.getElementById("subtotalEfectivo").textContent = `S/${subtotalEfectivo.toFixed(2)}`;
        document.getElementById("totalEfectivo").textContent = totalEfectivo.toFixed(0);
    }
}

document.getElementById("btnRegistrar").addEventListener("click", function() {
    mostrarSeccion('registrarSection');
});

document.getElementById("btnListar").addEventListener("click", function() {
    mostrarSeccion('listarSection');
});

document.getElementById("btnResumen").addEventListener("click", function() {
    mostrarSeccion('resumenSection');
});

function mostrarSeccion(seccion) {
    document.getElementById("registrarSection").style.display = "none";
    document.getElementById("listarSection").style.display = "none";
    document.getElementById("resumenSection").style.display = "none";
    
    document.getElementById(seccion).style.display = "block";
}

document.addEventListener('DOMContentLoaded', function () {
    const productForm = document.getElementById('productForm');
    const productSelect = document.getElementById('product');
    const quantityInput = document.getElementById('quantity');
    const paymentTypeSelect = document.getElementById('paymentType');
    const recordsList = document.getElementById('recordsList');
    const productSummary = document.getElementById('productSummary');
    const totalYape = document.getElementById('totalYape');
    const totalEfectivo = document.getElementById('totalEfectivo');
    const subtotalYape = document.getElementById('subtotalYape');
    const subtotalEfectivo = document.getElementById('subtotalEfectivo');

    const productData = {};

    function addToSummary(productName, quantity, total) {
        if (!productData[productName]) {
            productData[productName] = { quantity: 0, total: 0 };
        }
        productData[productName].quantity += quantity;
        productData[productName].total += total;
    }

    function updateSummaryTable() {
        productSummary.innerHTML = '';
        for (const [productName, data] of Object.entries(productData)) {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const quantityCell = document.createElement('td');
            const totalCell = document.createElement('td');

            nameCell.textContent = productName;
            quantityCell.textContent = data.quantity;
            totalCell.textContent = `S/${data.total.toFixed(2)}`;

            row.appendChild(nameCell);
            row.appendChild(quantityCell);
            row.appendChild(totalCell);
            productSummary.appendChild(row);
        }
    }

    productForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const productCost = parseFloat(productSelect.value);
        const productName = productSelect.options[productSelect.selectedIndex].getAttribute('data-name');
        const quantity = parseInt(quantityInput.value);
        const paymentType = paymentTypeSelect.value;

        const total = productCost * quantity;

        const recordRow = document.createElement('tr');

        recordRow.innerHTML = `
            <td>${quantity}</td>
            <td>${productName}</td>
            <td>S/${productCost.toFixed(2)}</td>
            <td>${paymentType}</td>
        `;
        recordsList.appendChild(recordRow);

        addToSummary(productName, quantity, total);
        updateSummaryTable();

        if (paymentType === 'yape') {
            totalYape.textContent = parseInt(totalYape.textContent) + quantity;
            subtotalYape.textContent = `S/${(parseFloat(subtotalYape.textContent.slice(2)) + total).toFixed(2)}`;
        } else if (paymentType === 'efectivo') {
            totalEfectivo.textContent = parseInt(totalEfectivo.textContent) + quantity;
            subtotalEfectivo.textContent = `S/${(parseFloat(subtotalEfectivo.textContent.slice(2)) + total).toFixed(2)}`;
        }

        productForm.reset();
        document.getElementById("productCost").textContent = "S/0.00";
    });

    // Evento para mostrar el costo del producto seleccionado
    document.getElementById("product").addEventListener("change", function() {
        var selectedOption = this.options[this.selectedIndex];
        var productCost = selectedOption.value;
        document.getElementById("productCost").textContent = `S/${productCost}`;
    });

    // Funciones para cambiar de sección
    function mostrarSeccion(seccion) {
        document.getElementById("menuSection").style.display = "none";
        document.getElementById("registrarSection").style.display = "none";
        document.getElementById("listarSection").style.display = "none";
        document.getElementById("resumenSection").style.display = "none";
        
        document.getElementById(seccion).style.display = "block";
    }

    document.getElementById("btnRegistrar").addEventListener("click", function() {
        mostrarSeccion('registrarSection');
    });

    document.getElementById("btnListar").addEventListener("click", function() {
        mostrarSeccion('listarSection');
    });

    document.getElementById("btnResumen").addEventListener("click", function() {
        mostrarSeccion('resumenSection');
    });
});

