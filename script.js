
const table = {
    5: 540, 10: 1080, 15: 1620, 20: 2160,
    30: 3240, 40: 4320, 60: 6480, 80: 8640,
    100: 10800, 120: 12960, 150: 16200, 200: 21600,
    250: 27000, 300: 32400, 350: 37800, 400: 43200, 500: 54000
};

function calculateRecommendation() {
    const bill = parseFloat(document.getElementById("monthlyBillSimple").value);
    const rate = 4.5;
    const usage = bill / rate;

    let closest = 5;
    let diff = Infinity;

    for (const kW in table) {
        const kWh = table[kW];
        if (Math.abs(kWh - usage) < diff) {
            diff = Math.abs(kWh - usage);
            closest = kW;
        }
    }

    let result = `
        ✅ ขนาดระบบติดตั้ง: ${closest} kW<br>
        ✅ ผลิตไฟเฉลี่ยต่อวัน: ${(table[closest]/30).toFixed(1)} หน่วย<br>
        ✅ ผลิตไฟเฉลี่ยต่อเดือน: ${table[closest]} หน่วย<br>
        ✅ ช่วยประหยัดค่าไฟได้: ${(table[closest] * rate).toFixed(2)} บาท/เดือน<br>
        ✅ ค่าไฟเดิมของลูกค้า: ${bill.toFixed(2)} บาท หรือ ${(usage).toFixed(2)} หน่วย<br>
        ✅ ค่าไฟที่เหลือต้องจ่ายจริง: ${(bill - table[closest]*rate).toFixed(2)} บาท/เดือน<br>
        ✅ ระยะเวลาคืนทุน: ประมาณ ${(closest * 30000 / (table[closest]*rate)).toFixed(1)} เดือน (~${(closest * 30000 / (table[closest]*rate) / 12).toFixed(1)} ปี)
    `;

    if (usage > 54000) {
        result = result.replace(
            /ค่าไฟที่เหลือต้องจ่ายจริง: (.*?) บาท\/เดือน/,
            'ค่าไฟที่เหลือต้องจ่ายจริง: <span style="color:red">$1 บาท/เดือน</span>'
        );
        result = result.replace(
            /ระยะเวลาคืนทุน: ประมาณ (.*?) เดือน \(~(.*?) ปี\)/,
            'ระยะเวลาคืนทุน: <span style="color:red">ประมาณ $1 เดือน (~$2 ปี)</span>'
        );
        result += `<br><br><span style="color:red">🔸 <b>หมายเหตุ:</b> ระบบสามารถคำนวณสูงสุดได้ 500 kW หากเกินกว่านี้ กรุณาใช้การคำนวณแบบละเอียดด้านล่าง</span>`;
    }

    document.getElementById("recommendationResult").innerHTML = result;
}

function clearRecommendation() {
    document.getElementById("monthlyBillSimple").value = "";
    document.getElementById("recommendationResult").innerHTML = "";
}

function calculate() {
    const systemSize = parseFloat(document.getElementById("systemSize").value);
    const installationCost = parseFloat(document.getElementById("installationCost").value);
    const electricityRate = parseFloat(document.getElementById("electricityRate").value);
    const sunHours = parseFloat(document.getElementById("sunHours").value);
    const efficiencyInput = parseFloat(document.getElementById("efficiency").value);
    const monthlyBill = parseFloat(document.getElementById("monthlyBill").value);

    const resultBox = document.getElementById("result");
    resultBox.innerHTML = "";

    if (systemSize <= 0 || installationCost <= 0 || electricityRate <= 0 || sunHours <= 0 || efficiencyInput <= 0 || monthlyBill <= 0) {
        resultBox.innerHTML = `<p style="color:red;">❌ กรุณากรอกข้อมูลให้ครบทุกช่องและเป็นค่าที่มากกว่า 0</p>`;
        return;
    }

    if (efficiencyInput > 100 || efficiencyInput < 10) {
        resultBox.innerHTML = `<p style="color:red;">⚠️ ค่า "ประสิทธิภาพการรับแสง" ควรอยู่ระหว่าง 10% ถึง 100%</p>`;
        return;
    }

    const efficiency = efficiencyInput / 100;
    const dailyOutputKWh = systemSize * sunHours * efficiency;
    const monthlyOutputKWh = dailyOutputKWh * 30;
    const monthlySaving = monthlyOutputKWh * electricityRate;
    const paybackPeriod = installationCost / monthlySaving;

    const estimatedUsageKWh = monthlyBill / electricityRate;
    let remainingBill = monthlyBill - monthlySaving;
    if (remainingBill < 0) remainingBill = 0;

    let warning = "";
    if (monthlyOutputKWh < estimatedUsageKWh * 0.5) {
        warning = `<p style="color:orange;">⚠️ ระบบที่เลือกอาจมีขนาดเล็กกว่าการใช้งานจริงมาก อาจพิจารณาขยายระบบเพื่อประหยัดค่าไฟได้มากขึ้น</p>`;
    }

    resultBox.innerHTML = `
        ✅ <strong>ขนาดระบบติดตั้ง:</strong> ${systemSize.toFixed(2)} kW<br>
        ✅ <strong>ผลิตไฟเฉลี่ยต่อวัน:</strong> ${dailyOutputKWh.toFixed(2)} หน่วย<br>
        ✅ <strong>ผลิตไฟเฉลี่ยต่อเดือน:</strong> ${monthlyOutputKWh.toFixed(2)} หน่วย<br>
        ✅ <strong>ช่วยประหยัดค่าไฟได้:</strong> ${monthlySaving.toFixed(2)} บาท/เดือน<br>
        ✅ <strong>ค่าไฟเดิมของลูกค้า:</strong> ${monthlyBill.toFixed(2)} บาท หรือ ${estimatedUsageKWh.toFixed(2)} หน่วย<br>
        ✅ <strong>ค่าไฟที่เหลือต้องจ่ายจริง:</strong> ${remainingBill.toFixed(2)} บาท/เดือน<br>
        ✅ <strong>ระยะเวลาคืนทุน:</strong> ประมาณ ${paybackPeriod.toFixed(1)} เดือน (${(paybackPeriod / 12).toFixed(1)} ปี)
        ${warning}
    `;
}

function clearForm() {
    document.getElementById("systemSize").value = "";
    document.getElementById("installationCost").value = "";
    document.getElementById("electricityRate").value = "";
    document.getElementById("sunHours").value = "";
    document.getElementById("efficiency").value = "";
    document.getElementById("monthlyBill").value = "";
    document.getElementById("result").innerHTML = "";
}
