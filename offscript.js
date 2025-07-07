// SolarCalculation v4.2 by mpplearning
// License: Non-Commercial Use Only
// Contact: punmanee@gmail.com

function calculateOffGrid() {
    const bill = parseFloat(document.getElementById("monthlyBill").value.replace(/,/g, ''));
    const hours = parseFloat(document.getElementById("backupHours").value);
    const resultDiv = document.getElementById("results");
    resultDiv.innerHTML = "";

    if (isNaN(bill) || isNaN(hours) || bill <= 0 || hours <= 0 || hours >= 20) {
        resultDiv.innerHTML = `
            <div class="error-box">
                ⚠️ <strong>กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</strong><br>
                ❌ ค่าไฟต้องมีค่ามากกว่า 0 และชั่วโมงต้องมีจำนวนระหว่าง 1-19
            </div>
        `;
        return;
    }

    const unitRate = 4.5;
    const avgSunHours = 5;
    const systemEfficiency = 0.8;
    const voltage = 48;

    const monthlyUsageKWh = bill / unitRate;
    const dailyUsageKWh = monthlyUsageKWh / 30;
    const dayUsage = (dailyUsageKWh / 24) * 5;
    const nightUsage = (dailyUsageKWh / 24) * hours;
    const requiredEnergy = nightUsage;
    const batteryAh = (requiredEnergy * 1000) / voltage;
    const solarKW = requiredEnergy / avgSunHours;
    const dailySolarKWh = solarKW * avgSunHours;
    const chargePerHourAh = (solarKW * 1000 / voltage) * systemEfficiency;
    const solarProduction = dailySolarKWh * systemEfficiency;
    const remainingEnergy = solarProduction - dayUsage;
    const chargeTimeHours = batteryAh / chargePerHourAh;
    const solarKWFullSystem = dailyUsageKWh / (avgSunHours * systemEfficiency);

    const format = num => num.toLocaleString(undefined, { maximumFractionDigits: 2 });

    const result = `
    ✅ พลังงานใช้ต่อวันโดยประมาณ: ${format(dailyUsageKWh)} kWh  
    ☀️ พลังงานใช้ช่วง 10:00–15:00 (Peak Sun Hours): ${format(dayUsage)} kWh  
    🌙 พลังงานที่ต้องสำรองไว้ใช้ ${hours} ชั่วโมง: ${format(nightUsage)} kWh  
    🔋 ความจุแบตเตอรี่ที่แนะนำ: ประมาณ ${format(batteryAh)} Ah @48V  
    ☀️ ขนาดแผงโซล่าร์เซลล์ที่แนะนำ (สำหรับกลางวัน): ${format(solarKW)} kW  
    ⚡️ ผลิตไฟฟ้าได้จริงจากแผงนี้: ${format(solarProduction)} kWh/วัน  
    🔌 เหลือพลังงานสำหรับชาร์จแบต: ${format(remainingEnergy)} kWh  
    ⏱️ ต้องใช้เวลาชาร์จแบตฯ ${format(chargeTimeHours)} ชั่วโมง (หากใช้แผงตามนี้)  
    📈 หากต้องการใช้ + ชาร์จแบตให้ครบภายใน 1 วัน ควรใช้แผงขนาด: ${format(solarKWFullSystem)} kW  

    📝 หมายเหตุ: คำนวณจากแดดเฉลี่ย ${avgSunHours} ชั่วโมง/วัน (Peak Sun Hours 10:00–15:00) และประสิทธิภาพระบบ ${systemEfficiency * 100}%
    `;

    resultDiv.innerHTML = `<div class="result-box">${result}</div>`;
}

function resetForm() {
    document.getElementById("monthlyBill").value = "";
    document.getElementById("backupHours").value = "";
    document.getElementById("results").innerHTML = "";
}

// SolarCalculation v4.2 by mpplearning
// License: Non-Commercial Use Only
// Contact: punmanee@gmail.com

let devicesDay = [];
let devicesNight = [];

const deviceOptions = {
  "กล้องวงจรปิด 1 ตัว": 15,
  "คอมพิวเตอร์ตั้งโต๊ะ": 600,
  "ชาร์จมือถือ": 10,
  "ตู้เย็น 7 คิว": 120,
  "ตู้เย็น 12 คิว": 180,
  "ตู้เย็น 15 คิว": 250,
  "ตู้เย็น 18 คิว": 300,
  "ตู้เย็น 21 คิว": 350,
  "ทีวี 50 นิ้ว": 150,
  "ทีวี 55 นิ้ว": 200,
  "ทีวี 65 นิ้ว": 250,
  "ทีวี 75 นิ้ว": 300,
  "ทีวี 85 นิ้ว": 400,
  "พัดลมตั้งพื้น": 70,
  "พัดลมเพดาน": 85,
  "รถ EV ชาร์จช้า": 2200,
  "หลอดไฟ LED 15W": 15,
  "หม้อทอดไร้น้ำมัน": 1500,
  "หม้อหุงข้าว": 700,
  "ไมโครเวฟ": 1500,
  "เครื่องกรองน้ำ": 30,
  "เครื่องชงกาแฟ": 1000,
  "เครื่องซักผ้า": 500,
  "เครื่องดูดฝุ่น": 1200,
  "เครื่องทำน้ำอุ่น": 3500,
  "เครื่องฟอกอากาศ": 45,
  "เครื่องอบผ้า": 1800,
  "เครื่องปิ้งขนมปัง": 800,
  "เตารีดไอน้ำ": 1800,
  "เตาอบไฟฟ้า (60 ลิตร)": 2200,
  "เตาแม่เหล็กไฟฟ้า (Induction)": 2000,
  "แอร์ 9000 BTU (เบอร์ 5)": 800,
  "แอร์ 12000 BTU (เบอร์ 5)": 1000,
  "แอร์ 15000 BTU (เบอร์ 5)": 1300,
  "แอร์ 18000 BTU (เบอร์ 5)": 1500,
  "แอร์ 24000 BTU (เบอร์ 5)": 1800,
  "แอร์ 36000 BTU (เบอร์ 5)": 2500,
  "โน๊ตบุ๊ค": 100
};

document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggleDetailBtn");
    const detailSection = document.getElementById("detailedSection");

    if (toggleBtn && detailSection) {
        toggleBtn.addEventListener("click", () => {
            detailSection.style.display = detailSection.style.display === "none" ? "block" : "none";
        });
    }

    const daySelect = document.getElementById("deviceSelect_day");
    const nightSelect = document.getElementById("deviceSelect_night");
    for (let key in deviceOptions) {
        const opt1 = new Option(key, key);
        const opt2 = new Option(key, key);
        if (daySelect) daySelect.appendChild(opt1);
        if (nightSelect) nightSelect.appendChild(opt2);
    }

    const monthlyBillInput = document.getElementById("monthlyBill");
    if (monthlyBillInput) {
        monthlyBillInput.addEventListener("input", function () {
            let raw = this.value.replace(/,/g, '');
            if (!isNaN(raw) && raw !== "") {
                this.value = parseFloat(raw).toLocaleString();
            } else if (raw === "") {
                this.value = "";
            }
        });
    }
});

function addSelectedDevice(type) {
    let name, power, hours;

    const selectId = type === 'day' ? 'deviceSelect_day' : 'deviceSelect_night';
    const customNameId = type === 'day' ? 'customDeviceName_day' : 'customDeviceName_night';
    const customPowerId = type === 'day' ? 'customDevicePower_day' : 'customDevicePower_night';
    const hourId = type === 'day' ? 'deviceHoursDayHour' : 'deviceHoursNightHour';
    const minId = type === 'day' ? 'deviceHoursDayMin' : 'deviceHoursNightMin';
    const errorId = type === 'day' ? 'error_day' : 'error_night';

    const errorEl = document.getElementById(errorId);
    errorEl.textContent = ""; // ล้างข้อความเก่าก่อน

    const selected = document.getElementById(selectId).value;

    if (selected === 'custom') {
        name = document.getElementById(customNameId).value;
        power = parseFloat(document.getElementById(customPowerId).value);
    } else {
        name = selected;
        power = deviceOptions[selected];
    }

    const hour = parseFloat(document.getElementById(hourId).value) || 0;
    const min = parseFloat(document.getElementById(minId).value) || 0;

    // ตรวจสอบค่าติดลบ
    if (hour < 0 || min < 0) {
        errorEl.textContent = "⛔ กรุณาอย่าใส่ค่าติดลบ";
        return;
    }

    hours = hour + (min / 60);
    const maxHours = type === 'day' ? 5 : 19;

    // ตรวจสอบเกินช่วงเวลา
    if (hours > maxHours) {
        errorEl.textContent = `⚠️ ช่วงเวลา ${type === 'day' ? "10:00–15:00" : "15:01–09:59"} ใช้ได้ไม่เกิน ${maxHours} ชั่วโมง`;
        return;
    }

    // ตรวจสอบค่าผิดพลาดอื่น ๆ
    if (!name || isNaN(power) || isNaN(hours) || hours <= 0) {
        errorEl.textContent = "⚠️ กรุณาระบุชื่ออุปกรณ์, กำลังไฟ และเวลาใช้งานให้ถูกต้อง";
        return;
    }

    const device = { name, power, hours, hourRaw: hour, minRaw: min };
    if (type === 'day') {
        devicesDay.push(device);
    } else {
        devicesNight.push(device);
    }

    renderDevices(type);

    // ล้างข้อมูลที่กรอกไว้ (optional)
    document.getElementById(hourId).value = "";
    document.getElementById(minId).value = "";
    if (selected === 'custom') {
        document.getElementById(customNameId).value = "";
        document.getElementById(customPowerId).value = "";
    }
}

function renderDevices(type) {
    const listId = type === 'day' ? 'deviceList' : 'nideviceList';
    const arr = type === 'day' ? devicesDay : devicesNight;
    const listDiv = document.getElementById(listId);

    listDiv.innerHTML = arr.map((d, index) =>
        `<div>${d.name} — ${d.power}W × ${d.hourRaw} ชม. ${d.minRaw} นาที 
         <button onclick="removeDevice('${type}', ${index})">❌</button></div>`
    ).join("");
}

function removeDevice(type, index) {
    const arr = type === 'day' ? devicesDay : devicesNight;
    arr.splice(index, 1);
    renderDevices(type);
}

function resetFormLoad(type) {
    if (type === 'day') {
        // เคลียร์ค่าทั้งหมดของช่วงกลางวัน
        document.getElementById("deviceSelect_day").value = "";
        if (document.getElementById("customDeviceName_day")) document.getElementById("customDeviceName_day").value = "";
        if (document.getElementById("customDevicePower_day")) document.getElementById("customDevicePower_day").value = "";
        if (document.getElementById("deviceHoursDayHour")) document.getElementById("deviceHoursDayHour").value = "";
        if (document.getElementById("deviceHoursDayMin")) document.getElementById("deviceHoursDayMin").value = "";
        if (document.getElementById("error_day")) document.getElementById("error_day").textContent = "";

        // ลบข้อมูลอุปกรณ์ที่เลือกไว้
        devicesDay = [];
        renderDevices('day');
    } else {
        // เคลียร์ค่าทั้งหมดของช่วงกลางคืน
        document.getElementById("deviceSelect_night").value = "";
        if (document.getElementById("customDeviceName_night")) document.getElementById("customDeviceName_night").value = "";
        if (document.getElementById("customDevicePower_night")) document.getElementById("customDevicePower_night").value = "";
        if (document.getElementById("deviceHoursNightHour")) document.getElementById("deviceHoursNightHour").value = "";
        if (document.getElementById("deviceHoursNightMin")) document.getElementById("deviceHoursNightMin").value = "";
        if (document.getElementById("error_night")) document.getElementById("error_night").textContent = "";
        
        // ลบข้อมูลอุปกรณ์ที่เลือกไว้
        devicesNight = [];
        renderDevices('night');
    }

    // ล้างผลการคำนวณรวม
    document.getElementById("resultArea").innerHTML = "";
}


function calculateTotalLoad() {
    const allDevices = [...devicesDay, ...devicesNight];
    if (allDevices.length === 0) {
        document.getElementById("resultArea").innerHTML = `
            <div class="error-boxload">
                ⚠️ <strong>กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</strong><br>
                ❌ ยังไม่มีรายการอุปกรณ์ไฟฟ้าที่ต้องการคำนวณ
            </div>
        `;
        return;
    }

    let totalWh = 0;
    let nightWh = 0;
    let dayWh = 0;

    devicesDay.forEach(d => {
        const energy = d.power * d.hours;
        totalWh += energy;
        dayWh += energy;
    });

    devicesNight.forEach(d => {
        const energy = d.power * d.hours;
        totalWh += energy;
        nightWh += energy;
    });

    const kWh = totalWh / 1000;
    const nightKWh = nightWh / 1000;
    const dayKWh = dayWh / 1000;

    const panelSize = kWh / 5 / 0.8;
    const batteryAh = nightKWh * 1000 / 48;
    const chargePerHourAh = (panelSize * 1000 / 48) * 0.8;
    const dailySolarKWh = panelSize * 5;
    const requiredBatteryAh = nightKWh * 1000 / 48;
    const avgPowerNight = nightWh / 19;
    const nightBackupHours = (batteryAh * 48) / avgPowerNight;
    const approxBill = kWh * 4.5 * 30;
    const format = num => num.toLocaleString(undefined, { maximumFractionDigits: 2 });

    let warningText = "";
    if (nightBackupHours < 19) {
        warningText = `
        <br><span style="color:red;"><b>⚠️ หมายเหตุ:</b> ความจุแบตเตอรี่ในระบบนี้สามารถสำรองได้เพียง ${format(nightBackupHours)} ชั่วโมง ซึ่งไม่ครบ 1 รอบกลางคืน (19 ชั่วโมง)</span>
        <br><span style="color:darkred;"><b>🔋 เพื่อสำรองไฟให้ครบ 19 ชั่วโมง</b> ควรใช้แบตเตอรี่ขนาดอย่างน้อย <b>${format(requiredBatteryAh)} Ah @48V</b></span>
        `;
    }

    document.getElementById("resultArea").innerHTML = `
        ⚡️ พลังงานใช้ช่วงกลางวัน (10:00–15:00): <b>${format(dayKWh)} kWh</b><br>
        🌙 พลังงานใช้ช่วงกลางคืน (15:01–09:59): <b>${format(nightKWh)} kWh</b><br>
        🔋 พลังงานใช้รวมต่อวัน: <b>${format(kWh)} kWh</b><br><br>

        ☀️ ขนาดแผงโซล่าร์ที่แนะนำ: <b>${format(panelSize)} kW</b><br>
        🔋 ความจุแบตเตอรี่ที่แนะนำ: <b>${format(batteryAh)} Ah @48V</b><br>
        🔋 ความจุแบตเตอรี่ที่ควรมีเพื่อสำรองครบ 1 รอบกลางคืน (19 ชม.): <b>${format(requiredBatteryAh)} Ah</b><br>
        ⏱️ ระบบสามารถสำรองไฟในช่วงกลางคืนได้ประมาณ: <b>${format(nightBackupHours)} ชั่วโมง</b><br>
        🔌 ชาร์จเข้าสู่แบตเตอรี่ได้ประมาณ: <b>${format(chargePerHourAh)} Ah/ชั่วโมง</b><br>
        ⚡️ ผลิตไฟฟ้าได้รวมต่อวันจากแผงโซลาร์: <b>${format(dailySolarKWh)} kWh</b><br><br>

        💰 คิดเป็นค่าไฟโดยประมาณ: <b>${format(approxBill)} บาท/เดือน</b><br><br>

        📝 <i>หมายเหตุ: คำนวณจากแดดเฉลี่ย 5 ชั่วโมง/วัน และประสิทธิภาพการรับแสง 80%</i>
        ${warningText}
    `;
}

function clearTotalLoad() {
    devicesDay = [];
    devicesNight = [];

    document.getElementById("deviceList").innerHTML = "";
    document.getElementById("nideviceList").innerHTML = "";
    document.getElementById("resultArea").innerHTML = "";
}
