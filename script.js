document.addEventListener('DOMContentLoaded', () => {
            const CONVERSION = { MONTHS_PER_YEAR: 12, ANNUAL_DISCOUNT: 0.90 };

            const calcForm = document.getElementById('calc-form');
            const serviceCheckboxes = document.querySelectorAll('.hprn-service-list-item input[type="checkbox"]');
            // Updated class name for blocks and inputs
            const configBlocks = document.querySelectorAll('.hprn-service-block');
            const monthlyDisplay = document.getElementById('total-monthly-display');
            const onceOffDisplay = document.getElementById('total-once-off-display');
            const annualizedDisplay = document.getElementById('total-annualized-display');

            function formatCurrency(value) {
                const safeValue = isNaN(value) ? 0 : Math.max(0, value);
                return new Intl.NumberFormat('en-ZA', {
                    style: 'currency',
                    currency: 'ZAR',
                    minimumFractionDigits: 0
                }).format(safeValue);
            }

            function resetServiceInputs(blockId) {
                const block = document.getElementById(blockId);
                if (block) {
                    block.querySelectorAll('input[type="number"]').forEach(input => input.value = 0);
                    block.querySelectorAll('select').forEach(select => select.value = 0);
                }
            }

            function handleServiceToggle(event) {
                const checkbox = event.target;
                const configBlockId = checkbox.getAttribute('data-target');
                const configBlock = document.getElementById(configBlockId);

                if (!configBlock) return;

                if (checkbox.checked) {
                    configBlock.style.display = 'block';
                } else {
                    configBlock.style.display = 'none';
                    resetServiceInputs(configBlockId);
                }

                calculateTotal();
            }

            function calculateTotal() {
                let totalMonthly = 0;
                let totalOnceOff = 0;
                let hasAnnualCommitment = false;

                // Web Development (CapEx)
                if (document.getElementById('check-web-dev').checked) {
                    const pkg = parseFloat(document.querySelector('[name="web-dev-package"]').value) || 0;
                    const pages = parseFloat(document.querySelector('[name="web-dev-pages"]').value) || 0;
                    const maintMonths = parseFloat(document.querySelector('[name="web-dev-maint-months"]').value) || 0;
                    
                    totalOnceOff += pkg + (pages * 2500);
                    totalMonthly += maintMonths * 3000;
                }

                // Mobile Development (CapEx)
                if (document.getElementById('check-mobile-dev').checked) {
                    const platform = parseFloat(document.querySelector('[name="mobile-dev-platform"]').value) || 0;
                    const complexity = parseFloat(document.querySelector('[name="mobile-dev-complexity"]').value) || 1;
                    const maintMonths = parseFloat(document.querySelector('[name="mobile-dev-maint-months"]').value) || 0;
                    
                    totalOnceOff += platform * complexity;
                    totalMonthly += maintMonths * 4000;
                }

                // Dev Maintenance (OpEx)
                if (document.getElementById('check-dev-maintenance').checked) {
                    const tier = parseFloat(document.querySelector('[name="dev-maint-tier"]').value) || 0;
                    const months = parseFloat(document.querySelector('[name="dev-maint-months"]').value) || 0;
                    totalMonthly += tier * months;
                }

                // API & Backend (CapEx)
                if (document.getElementById('check-api-services').checked) {
                    const scope = parseFloat(document.querySelector('[name="api-scope"]').value) || 0;
                    const endpoints = parseFloat(document.querySelector('[name="api-endpoints"]').value) || 0;
                    const databases = parseFloat(document.querySelector('[name="api-databases"]').value) || 0;
                    
                    totalOnceOff += scope + (endpoints * 3500) + (databases * 8000);
                }

                // E-commerce (CapEx)
                if (document.getElementById('check-ecommerce').checked) {
                    const platform = parseFloat(document.querySelector('[name="ecom-platform"]').value) || 0;
                    const gateways = parseFloat(document.querySelector('[name="ecom-payment-gateways"]').value) || 0;
                    const hostingMonths = parseFloat(document.querySelector('[name="ecom-hosting-months"]').value) || 0;
                    
                    totalOnceOff += platform + (gateways * 5000);
                    totalMonthly += hostingMonths * 6000;
                }

                // Cloud Computing (OpEx)
                if (document.getElementById('check-cloud-compute').checked) {
                    const vms = parseFloat(document.querySelector('[name="cloud-vm-count"]').value) || 0;
                    const storage = parseFloat(document.querySelector('[name="cloud-storage-tb"]').value) || 0;
                    const commitment = parseFloat(document.querySelector('[name="cloud-commitment"]').value) || 1;
                    
                    totalMonthly += (vms * 2200) + (storage * 1500);
                    if (commitment === 0.9) hasAnnualCommitment = true;
                }

                // IT Support (OpEx)
                if (document.getElementById('check-it-support').checked) {
                    const tier = parseFloat(document.querySelector('[name="it-support-tier"]').value) || 0;
                    const users = parseFloat(document.querySelector('[name="it-support-users"]').value) || 0;
                    const remoteHours = parseFloat(document.querySelector('[name="it-support-remote-hours"]').value) || 0;
                    
                    totalMonthly += tier + (users * 1200) + (remoteHours * 800);
                }

                // Data Center (OpEx)
                if (document.getElementById('check-datacenter').checked) {
                    const racks = parseFloat(document.querySelector('[name="dc-racks"]').value) || 0;
                    const backup = parseFloat(document.querySelector('[name="dc-backup-storage"]').value) || 0;
                    const monitoring = parseFloat(document.querySelector('[name="dc-monitoring-points"]').value) || 0;
                    
                    totalMonthly += (racks * 12000) + (backup * 2000) + (monitoring * 600);
                }

                // Marketing Campaigns (OpEx)
                if (document.getElementById('check-marketing-campaigns').checked) {
                    const tier = parseFloat(document.querySelector('[name="marketing-tier"]').value) || 0;
                    const months = parseFloat(document.querySelector('[name="marketing-duration-months"]').value) || 0;
                    const accounts = parseFloat(document.querySelector('[name="marketing-ad-accounts"]').value) || 0;
                    
                    totalMonthly += (tier * months) + (accounts * 2000 * months);
                }

                // Design Services (CapEx & OpEx)
                if (document.getElementById('check-design-services').checked) {
                    const capex = parseFloat(document.querySelector('[name="design-capex-package"]').value) || 0;
                    const opexHours = parseFloat(document.querySelector('[name="design-opex-hours"]').value) || 0;
                    const videos = parseFloat(document.querySelector('[name="design-video-production"]').value) || 0;
                    
                    totalOnceOff += capex + (videos * 15000);
                    totalMonthly += opexHours * 1200;
                }

                // Hardware (CapEx)
                if (document.getElementById('check-hardware').checked) {
                    const workstations = parseFloat(document.querySelector('[name="hardware-workstations"]').value) || 0;
                    const servers = parseFloat(document.querySelector('[name="hardware-servers"]').value) || 0;
                    const networking = parseFloat(document.querySelector('[name="hardware-networking"]').value) || 0;
                    const pos = parseFloat(document.querySelector('[name="hardware-pos-systems"]').value) || 0;
                    
                    totalOnceOff += (workstations * 30000) + (servers * 75000) + (networking * 18000) + (pos * 12000);
                }

                // Calculate annualized
                let totalAnnualized = totalMonthly * CONVERSION.MONTHS_PER_YEAR;
                if (hasAnnualCommitment) {
                    totalAnnualized = totalAnnualized * CONVERSION.ANNUAL_DISCOUNT;
                }

                // Updated class names in the display update logic
                monthlyDisplay.innerText = formatCurrency(totalMonthly);
                onceOffDisplay.innerText = formatCurrency(totalOnceOff);
                annualizedDisplay.innerText = formatCurrency(totalAnnualized);
            }

            // Initialize
            configBlocks.forEach(block => block.style.display = 'none');

            serviceCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', handleServiceToggle);
            });

            // Updated class name for inputs
            calcForm.querySelectorAll('input, select').forEach(input => {
                input.addEventListener('input', calculateTotal);
                input.addEventListener('change', calculateTotal);
            });

            calcForm.addEventListener('reset', (event) => {
                event.preventDefault();
                serviceCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        checkbox.checked = false;
                        handleServiceToggle({ target: checkbox });
                    }
                });
                calcForm.reset();
                calculateTotal();
            });

            calculateTotal();
        });