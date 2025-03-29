// Armazenamento local para o número da OS
let osNumber = localStorage.getItem('osNumber') || 1;
document.getElementById('os-number').textContent = `00-${osNumber.toString().padStart(4, '0')}`;

// Atualizar data atual
function updateCurrentDate() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    document.getElementById('current-date').textContent = `${day}/${month}/${year}`;
}
updateCurrentDate();

// Adicionar novo serviço
document.getElementById('add-service').addEventListener('click', function() {
    const serviceDescription = document.getElementById('service-description').value;
    if (!serviceDescription) {
        alert('Por favor, insira uma descrição para o serviço');
        return;
    }

    const tbody = document.getElementById('services-body');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><input type="number" class="quantity" value="1" min="1"></td>
        <td>${serviceDescription}</td>
        <td><input type="number" class="unit-price" step="0.01" min="0" placeholder="0,00"></td>
        <td class="service-total">R$ 0,00</td>
        <td><button class="remove">X</button></td>
    `;
    
    tbody.appendChild(row);
    
    // Limpar campo de descrição
    document.getElementById('service-description').value = '';
    
    // Adicionar eventos para os novos inputs
    addCalculationEvents(row);
    
    // Atualizar totais
    updateTotals();
});

// Adicionar eventos para cálculo
function addCalculationEvents(row) {
    const quantityInput = row.querySelector('.quantity');
    const unitPriceInput = row.querySelector('.unit-price');
    const removeButton = row.querySelector('.remove');
    
    quantityInput.addEventListener('input', updateServiceTotal);
    unitPriceInput.addEventListener('input', updateServiceTotal);
    
    function updateServiceTotal() {
        const quantity = parseFloat(quantityInput.value) || 0;
        const unitPrice = parseFloat(unitPriceInput.value) || 0;
        const total = quantity * unitPrice;
        
        row.querySelector('.service-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        updateTotals();
    }
    
    removeButton.addEventListener('click', function() {
        row.remove();
        updateTotals();
    });
}

// Atualizar totais
function updateTotals() {
    const serviceTotals = document.querySelectorAll('.service-total');
    let subtotal = 0;
    
    serviceTotals.forEach(cell => {
        const value = parseFloat(cell.textContent.replace('R$ ', '').replace(',', '.')) || 0;
        subtotal += value;
    });
    
    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('total').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

// Nova OS
document.getElementById('new-os').addEventListener('click', function() {
    // Incrementar número da OS
    osNumber++; //se quiser voltar o contador
    localStorage.setItem('osNumber', osNumber);
    document.getElementById('os-number').textContent = `00-${osNumber.toString().padStart(4, '0')}`;
    
    // Atualizar data
    updateCurrentDate();
    
    // Limpar campos
    document.getElementById('requested-by').value = '';
    document.getElementById('cpf-cnpj').value = '';
    document.getElementById('service-description').value = '';
    document.getElementById('services-body').innerHTML = '';
    document.getElementById('delivery-date').value = '';
    document.getElementById('observations').value = '';
    document.querySelectorAll('input[name="payment"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Resetar totais
    updateTotals();
});



// Imprimir OS
document.getElementById('print-os').addEventListener('click', function() {
    // Adiciona a classe que esconde os botões antes de imprimir
    document.querySelectorAll('button'||'logo-upload-controls').forEach(button => {
        button.classList.add('no-print');
    });

    // Dispara a impressão
    window.print();

    // Remove a classe depois (opcional, se quiser que os botões voltem a aparecer)
    setTimeout(() => {
        document.querySelectorAll('button').forEach(button => {
            button.classList.remove('no-print');
        });
    }, 500);
});



document.getElementById('cpf-cnpj').addEventListener('input', function(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é número

    // Verifica se é CPF (11 dígitos) ou CNPJ (14 dígitos)
    if (value.length <= 11) {
        // Formata como CPF (000.000.000-00)
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        // Formata como CNPJ (00.000.000/0000-00)
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }

    input.value = value; // Atualiza o campo com a máscara
});








const logoInput = document.getElementById('logo-input');
        const logoPreview = document.getElementById('logo-preview');
        const removeLogoBtn = document.getElementById('remove-logo');
        const logoUploadControls = document.getElementById('logo-upload-controls');

        // Função para atualizar o estado do upload
        function updateLogoUploadState(hasLogo) {
            if (hasLogo) {
                logoUploadControls.classList.add('logo-uploaded');
            } else {
                logoUploadControls.classList.remove('logo-uploaded');
            }
        }

        // Carregar logo salvo
        function loadSavedLogo() {
            const savedLogo = localStorage.getItem('companyLogo');
            if (savedLogo) {
                logoPreview.innerHTML = `<img src="${savedLogo}" alt="Logo da Empresa">`;
                updateLogoUploadState(true);
            }
        }
        
        loadSavedLogo();

        // Upload de novo logo
        logoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const logoUrl = event.target.result;
                    logoPreview.innerHTML = `<img src="${logoUrl}" alt="Logo da Empresa">`;
                    localStorage.setItem('companyLogo', logoUrl);
                    updateLogoUploadState(true);
                };
                reader.readAsDataURL(file);
            }
        });

        // Remover logo
        removeLogoBtn.addEventListener('click', function() {
            logoPreview.innerHTML = '<span style="color: #999;">Sem logo</span>';
            localStorage.removeItem('companyLogo');
            logoInput.value = '';
            updateLogoUploadState(false);
        });





 // Configurar data de entrega (padrão: 3 dias após a data atual)
 document.getElementById('delivery-date').addEventListener('focus', function() {
    if (!this.value) {
        const today = new Date();
        today.setDate(today.getDate() + 3); // 3 dias após a data atual
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        this.value = `${yyyy}-${mm}-${dd}`;
    }
});



// Formatar para exibição (opcional)
function formatDeliveryDate() {
    if (deliveryDateInput.value) {
        const [yyyy, mm, dd] = deliveryDateInput.value.split('-');
        return `${dd}/${mm}/${yyyy}`;
    }
    return "A combinar";
}









