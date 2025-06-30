// Placeholder for On-Grid script logic in future
console.log("Script loaded for solar system UI");
const table = {
    5: 540, 10: 1080, 15: 1620, 20: 2160,
    30: 3240, 40: 4320, 60: 6480, 80: 8640,
    100: 10800, 120: 12960, 150: 16200, 200: 21600,
    250: 27000, 300: 32400, 350: 37800, 400: 43200,
    500: 54000, 600: 64800, 700: 75600, 800: 86400,
    900: 97200, 1000: 108000
};

function formatNumber(num) {
    return parseFloat(num).toLocaleString('en-US');
}

function getInputNumber(id) {
    return parseFloat(document.getElementById(id).value.replace(/,/g, '')) || 0;
}

function formatInputFields() {
    document.querySelectorAll("input[type=text]").forEach(input => {
        input.addEventListener("blur", () => {
            const value = input.value.replace(/,/g, '');
            const number = parseFloat(value);
            if (!isNaN(number)) input.value = number.toLocaleString('en-US');
        });
        input.addEventListener("focus", () => {
            input.value = input.value.replace(/,/g, '');
        });
    });
}
window.onload = formatInputFields;

function calculateRecommendation() {
    const bill = getInputNumber("monthlyBillSimple");
    const resultDiv = document.getElementById("recommendationResult");

    if (bill <= 0 || isNaN(bill)) {
        resultDiv.innerHTML = `<p style="color:red;">❌ กรุณากรอกข้อมูลค่าไฟที่ใช้จ่ายต่อเดือน</p>`;
        return;
    }

    const rate = 4.5;
    const usage = bill / rate;

    const maxSupportKW = 500;
const maxSupportKWh = table[maxSupportKW]; // 54,000 หน่วย

if (usage > maxSupportKWh) {
    resultDiv.innerHTML = `<p style="color:red;">❌ ระบบสามารถคำนวณสูงสุดได้ 500 kW หากเกินกว่านี้ กรุณาใช้การคำนวณแบบละเอียดด้านล่าง</p>`;
    return;
}


    // ตรวจสอบว่ามีการเลือกเปอร์เซ็นต์การประหยัดหรือไม่
    const selectedTarget = document.querySelector('input[name="savingTarget"]:checked');
    let targetUsage = usage;
    if (selectedTarget) {
       const percent = parseInt(selectedTarget.value);
        targetUsage = usage * (1 - percent / 100);

    }

    let closest = 5;
    let diff = Infinity;

    for (const kW in table) {
        const kWh = table[kW];
        if (Math.abs(kWh - targetUsage) < diff) {
            diff = Math.abs(kWh - targetUsage);
            closest = kW;
        }
    }

    const savingBaht = table[closest] * rate;
    const savingPercent = (savingBaht / bill) * 100;
    const remainingBill = Math.max(bill - savingBaht, 0);

    let result = `
        ✅ ขนาดระบบติดตั้ง: ${closest} kW<br>
        ✅ ผลิตไฟเฉลี่ยต่อวัน: ${formatNumber((table[closest] / 30).toFixed(1))} หน่วย<br>
        ✅ ผลิตไฟเฉลี่ยต่อเดือน: ${formatNumber(table[closest])} หน่วย<br>
        ✅ ช่วยประหยัดค่าไฟได้: ${formatNumber(savingBaht.toFixed(2))} บาท/เดือน<br>
        ✅ ค่าไฟเดิมของลูกค้า: ${formatNumber(bill.toFixed(2))} บาท หรือ ${formatNumber(usage.toFixed(2))} หน่วย<br>
        ✅ ค่าไฟที่เหลือต้องจ่ายจริง: ${formatNumber(remainingBill.toFixed(2))} บาท/เดือน<br>
        ✅ <strong style="color:green">ประหยัดไปแล้ว: ${savingPercent.toFixed(0)}%</strong><br>
    `;

    if (usage > 54000) {
        result = result.replace(
            /ค่าไฟที่เหลือต้องจ่ายจริง: (.*?) บาท\/เดือน/,
            'ค่าไฟที่เหลือต้องจ่ายจริง: <span style="color:red">$1 บาท/เดือน</span>'
        );
        result += `<br><br><span style="color:red">🔸 <b>หมายเหตุ:</b> ระบบสามารถคำนวณสูงสุดได้ 500 kW หากเกินกว่านี้ กรุณาใช้การคำนวณแบบละเอียดด้านล่าง</span>`;
    }

    resultDiv.innerHTML = result;
}

function clearRecommendation() {
    document.getElementById("monthlyBillSimple").value = "";
    document.getElementById("recommendationResult").innerHTML = "";

    const radios = document.querySelectorAll('input[name="savingTarget"]');
    radios.forEach(radio => radio.checked = false);
}

function calculate() {
    const systemSize = getInputNumber("systemSize");
    const installationCost = getInputNumber("installationCost");
    const electricityRate = getInputNumber("electricityRate");
    const sunHours = getInputNumber("sunHours");
    const efficiencyInput = getInputNumber("efficiency");
    const monthlyBill = getInputNumber("monthlyBill");

    const resultBox = document.getElementById("result");
    resultBox.innerHTML = "";

    if ([systemSize, installationCost, electricityRate, sunHours, efficiencyInput, monthlyBill].some(v => v <= 0)) {
        resultBox.innerHTML = `<p style="color:red;">❌ กรุณากรอกข้อมูลให้ครบทุกช่องและเป็นค่าที่มากกว่า 0</p>`;
        return;
    }

    if (efficiencyInput > 100 || efficiencyInput < 10) {
        resultBox.innerHTML = `<p style="color:red;">⚠️ ค่า "ประสิทธิภาพการรับแสง" ควรอยู่ระหว่าง 10% ถึง 100%</p>`;
        return;
    }

    const efficiency = efficiencyInput / 100;
    const dailyOutput = systemSize * sunHours * efficiency;
    const monthlyOutput = dailyOutput * 30;
    const saving = monthlyOutput * electricityRate;
    const payback = installationCost / saving;
    const usage = monthlyBill / electricityRate;
    const remaining = Math.max(monthlyBill - saving, 0);

    let warning = '';
    if (monthlyOutput < usage * 0.5) {
        warning = `<p style="color:orange;">⚠️ ระบบอาจมีขนาดเล็กกว่าความต้องการจริงมาก</p>`;
    }

    const savingPercent = (saving / monthlyBill) * 100;

    resultBox.innerHTML = `
        ✅ <strong>ขนาดระบบติดตั้ง:</strong> ${formatNumber(systemSize.toFixed(2))} kW<br>
        ✅ <strong>ผลิตไฟเฉลี่ยต่อวัน:</strong> ${formatNumber(dailyOutput.toFixed(2))} หน่วย<br>
        ✅ <strong>ผลิตไฟเฉลี่ยต่อเดือน:</strong> ${formatNumber(monthlyOutput.toFixed(2))} หน่วย<br>
        ✅ <strong>ช่วยประหยัดค่าไฟได้:</strong> ${formatNumber(saving.toFixed(2))} บาท/เดือน<br>
        ✅ <strong>ค่าไฟเดิมของลูกค้า:</strong> ${formatNumber(monthlyBill.toFixed(2))} บาท หรือ ${formatNumber(usage.toFixed(2))} หน่วย<br>
        ✅ <strong>ค่าไฟที่เหลือต้องจ่ายจริง:</strong> ${formatNumber(remaining.toFixed(2))} บาท/เดือน<br>
        ✅ <strong>ระยะเวลาคืนทุน:</strong> ${formatNumber(payback.toFixed(1))} เดือน (~${formatNumber((payback/12).toFixed(1))} ปี)<br>
        ✅ <strong style="color:green">ประหยัดไปแล้ว: ${savingPercent.toFixed(2)}%</strong><br>
        ${warning}
    `;
}

function clearForm() {
    ["monthlyBill", "systemSize", "installationCost", "electricityRate", "sunHours", "efficiency"].forEach(id => {
        document.getElementById(id).value = "";
    });
    document.getElementById("result").innerHTML = "";
}
// จัดการปุ่มลด %
document.querySelectorAll('.saving-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.saving-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const percent = this.getAttribute('data-value');
    document.querySelectorAll('input[name="savingTarget"]').forEach(r => r.checked = false); // เคลียร์ radio เดิม
    const fakeRadio = document.createElement('input');
    fakeRadio.type = 'radio';
    fakeRadio.name = 'savingTarget';
    fakeRadio.value = percent;
    fakeRadio.checked = true;
    fakeRadio.style.display = 'none';
    document.body.appendChild(fakeRadio);
  });
});
