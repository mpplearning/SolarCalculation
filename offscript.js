// SolarCalculation v4.0 by mpplearning
// License: Non-Commercial Use Only
// Contact: punmanee@gmail.com

function calculateOffGrid() {
    const bill = parseFloat(document.getElementById("monthlyBill").value);
    const hours = parseFloat(document.getElementById("backupHours").value);
    const resultDiv = document.getElementById("results");
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

    const unitRate = 4.5; // หน่วยละ 4.5 บาท
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

    const format = num => num.toLocaleString(undefined, { maximumFractionDigits: 2 });

    const result = `
        ✅ พลังงานใช้ต่อวันโดยประมาณ: ${format(dailyUsageKWh)} kWh
        ✅ ต้องสำรองไฟไว้ใช้ ${hours} ชั่วโมง/วัน คิดเป็นพลังงาน ${format(requiredEnergy)} kWh
        ✅ ขนาดแบตเตอรี่ที่แนะนำ: ประมาณ ${format(batteryAh)} Ah (ที่ 48V)
        ✅ ขนาดแผงโซล่าร์ที่แนะนำ: ประมาณ ${format(solarKW)} kW
        ✅ สามารถผลิตไฟฟ้าได้ต่อวัน: ประมาณ ${format(dailySolarKWh)} kWh
        ✅ และชาร์จเข้าสู่แบตเตอรี่ได้ประมาณ: ${format(chargePerHourAh)} Ah/ชั่วโมง

📝 หมายเหตุ: คำนวณจากแดดเฉลี่ย ${avgSunHours} ชั่วโมง/วัน และประสิทธิภาพระบบ ${systemEfficiency * 100}%
`;

    resultDiv.innerHTML = `<div class="result-box">${result}</div>`;
}

function resetForm() {
    document.getElementById("monthlyBill").value = "";
    document.getElementById("backupHours").value = "";
    document.getElementById("results").innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggleDetailBtn");
    const detailSection = document.getElementById("detailedSection");

    toggleBtn.addEventListener("click", () => {
        detailSection.style.display = detailSection.style.display === "none" ? "block" : "none";
    });
});

let devicesDay = [];
let devicesNight = [];

const deviceOptions = {
    "หลอดไฟ LED 15W": 15,
    "ทีวี 50 นิ้ว": 150,
    "ทีวี 55 นิ้ว": 200,
    "ทีวี 65 นิ้ว": 250,
    "ทีวี 75 นิ้ว": 300,
    "ทีวี 85 นิ้ว": 400,
    "แอร์ 9000 BTU (เบอร์ 5)": 800,
    "แอร์ 12000 BTU (เบอร์ 5)": 1000,
    "แอร์ 15000 BTU (เบอร์ 5)": 1300,
    "แอร์ 18000 BTU (เบอร์ 5)": 1500,
    "แอร์ 24000 BTU (เบอร์ 5)": 1800,
    "แอร์ 36000 BTU (เบอร์ 5)": 2500,
    "ตู้เย็น 7 คิว": 120,
    "ตู้เย็น 12 คิว": 180,
    "ตู้เย็น 15 คิว": 250,
    "ตู้เย็น 18 คิว": 300,
    "ตู้เย็น 21 คิว": 350,
    "พัดลมตั้งพื้น": 70,
    "โน๊ตบุ๊ค": 100,
    "คอมพิวเตอร์ตั้งโต๊ะ": 600,
    "เครื่องซักผ้า": 500,
    "เครื่องทำน้ำอุ่น": 3500,
    "ไมโครเวฟ": 1500,
    "หม้อหุงข้าว": 700,
    "เครื่องฟอกอากาศ": 45,
    "ชาร์จมือถือ": 10,
    "รถ EV ชาร์จช้า": 2200,
    "เตารีดไอน้ำ": 1800
};

document.addEventListener("DOMContentLoaded", () => {
    const selects = ["deviceSelect", "nideviceSelect"];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        for (const name in deviceOptions) {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        }
    });
});

function addSelectedDevice(type) {
    const name = document.getElementById(type === 'day' ? "deviceSelect" : "nideviceSelect").value;
    const power = deviceOptions[name];
    const hours = parseFloat(document.getElementById(type === 'day' ? "deviceHoursDay" : "deviceHoursNight").value);

    if (!name || isNaN(power) || isNaN(hours)) {
        document.getElementById("resultArea").innerHTML = `
            <div style="color: red; border: 1px solid red; padding: 10px; border-radius: 8px; background-color: #ffe5e5;">
              ⚠️ <strong>กรุณาเลือกอุปกรณ์และกรอกชั่วโมงการใช้งานให้ครบถ้วน</strong>
            </div>
        `;
        return;
    }

    const targetArray = type === 'day' ? devicesDay : devicesNight;
    targetArray.push({ name, power, hours });
    renderDevices(type);
}

function renderDevices(type) {
    const list = document.getElementById(type === 'day' ? "deviceList" : "nideviceList");
    const source = type === 'day' ? devicesDay : devicesNight;
    list.innerHTML = "";

    source.forEach((d, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
            ${i + 1}. ${d.name} | ${d.power}W | ${d.hours} ชั่วโมง/วัน 
            <span onclick="removeDevice('${type}', ${i})" style="color:red; cursor: pointer; margin-left:10px;">❌</span>
        `;
        list.appendChild(div);
    });
}

function removeDevice(type, index) {
    const arr = type === 'day' ? devicesDay : devicesNight;
    arr.splice(index, 1);
    renderDevices(type);
}

function resetFormLoad(type) {
    if (type === 'day') {
        document.getElementById("deviceSelect").value = "";
        document.getElementById("deviceHoursDay").value = "";
        devicesDay = [];
        document.getElementById("deviceList").innerHTML = "";
    } else {
        document.getElementById("nideviceSelect").value = "";
        document.getElementById("deviceHoursNight").value = "";
        devicesNight = [];
        document.getElementById("nideviceList").innerHTML = "";
    }
    document.getElementById("resultArea").innerHTML = "";
}

function calculateTotalLoad() {
    const allDevices = [...devicesDay, ...devicesNight];
    if (allDevices.length === 0) {
        document.getElementById("resultArea").innerHTML = `
            <div style="color: red; border: 1px solid red; padding: 10px; border-radius: 8px; background-color: #ffe5e5;">
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

    const panelSize = (kWh / 5 / 0.8); // system size in kW
    const batteryAh = (nightKWh * 1000 / 48); // 48V system (คำนวณจากโหลดกลางคืน)
    const chargePerHourAh = (panelSize * 1000 / 48) * 0.8;
    const dailySolarKWh = panelSize * 5;

    // ใหม่: คำนวณความจุแบตเตอรี่ที่ “ควรใช้” เพื่อสำรอง 19 ชั่วโมง
    const requiredBatteryAh = nightKWh * 1000 / 48;
    const avgPowerNight = nightWh / 19; // W
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



