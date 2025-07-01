// SolarCalculation v4.0 by mpplearning
// License: Non-Commercial Use Only
// Contact: punmanee@gmail.com

// Placeholder for Off-Grid script logic in future

function calculateOffGrid() {
    const bill = parseFloat(document.getElementById("monthlyBill").value);
    const hours = parseFloat(document.getElementById("backupHours").value);
    const resultDiv = document.getElementById("results");

    // ✅ เคลียร์ผลลัพธ์เก่าก่อนเริ่มคำนวณใหม่
    resultDiv.innerHTML = "";

    if (isNaN(bill) || isNaN(hours) || bill <= 0 || hours <= 0) {
        resultDiv.innerHTML = `
            <div class="error-box">
                ⚠️ <strong>กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</strong><br>
                ❌ ค่าไฟและชั่วโมงต้องมีจำนวนมากกว่า 0
            </div>
        `;
        return;
    }

    // ... (คำนวณตามปกติ)


    const unitRate = 4.32;
    const avgSunHours = 5;
    const systemEfficiency = 0.8;
    const voltage = 48;

    const monthlyUsageKWh = bill / unitRate;
    const dailyUsageKWh = monthlyUsageKWh / 30;
    const requiredEnergy = (dailyUsageKWh / 24) * hours;
    const batteryAh = (requiredEnergy * 1000) / voltage;
    const solarKW = requiredEnergy / avgSunHours;
    const dailySolarKWh = solarKW * avgSunHours;
    const chargePerHourAh = (solarKW * 1000 / voltage) * systemEfficiency;

    const format = num => num.toLocaleString(undefined, {maximumFractionDigits: 2});

    const result = `
        ✅ พลังงานใช้ต่อวันโดยประมาณ: ${format(dailyUsageKWh)} kWh
        ✅ ขนาดแบตเตอรี่ที่แนะนำ: ประมาณ ${format(batteryAh)} Ah (ที่ 48V)
        ✅ ขนาดแผงโซล่าร์ที่แนะนำ: ประมาณ ${format(solarKW)} kW
        ✅ สามารถผลิตไฟฟ้าได้ต่อวัน: ประมาณ ${format(dailySolarKWh)} kWh
        ✅ และชาร์จเข้าสู่แบตเตอรี่ได้ประมาณ: ${format(chargePerHourAh)} Ah/ชั่วโมง

📝 หมายเหตุ: คำนวณจากแดดเฉลี่ย ${avgSunHours} ชั่วโมง/วัน และประสิทธิภาพระบบ ${systemEfficiency * 100}%
`;

    document.getElementById("results").textContent = result;
}

function resetForm() {
    document.getElementById("monthlyBill").value = "";
    document.getElementById("backupHours").value = "";
    document.getElementById("results").textContent = "";
}
