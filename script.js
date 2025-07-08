// SolarCalculation On-Grid v4.2 by mpplearning
// License: Non-Commercial Use Only
// Contact: punmanee@gmail.com

document.addEventListener("DOMContentLoaded", function () {
    const monthlyBillInput = document.getElementById("monthlyBill");
    const resultDiv = document.getElementById("results");

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

    const calcBtn = document.getElementById("calculateBtn");
    if (calcBtn) {
        calcBtn.addEventListener("click", calculateOnGrid);
    }

    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", resetForm);
    }
});

function calculateOnGrid() {
    const billInput = document.getElementById("monthlyBill");
    const dayPercentInput = document.getElementById("dayUsagePercent");
    const resultDiv = document.getElementById("results");

    const bill = parseFloat(billInput.value.replace(/,/g, ''));
    const dayPercent = parseFloat(dayPercentInput.value);

    if (isNaN(bill) || bill <= 0) {
        resultDiv.innerHTML = `
            <div class="error-box">
                ⚠️ <strong>กรุณากรอกค่าไฟต่อเดือนให้ถูกต้อง</strong><br>
                ❌ ต้องมากกว่า 0 บาท
            </div>
        `;
        return;
    }

    if (isNaN(dayPercent) || dayPercent < 1 || dayPercent > 100) {
        resultDiv.innerHTML = `
            <div class="error-box">
                ⚠️ <strong>กรุณาระบุเปอร์เซ็นต์การใช้ไฟช่วงกลางวัน (1–100%)</strong><br>
                ❌ ค่าที่กรอก: ${dayPercentInput.value || "ว่างเปล่า"}
            </div>
        `;
        return;
    }

    const rate = 4.5;
    const avgSunHours = 5;
    const efficiency = 0.8;

    const dayUsageRatio = dayPercent / 100;
    const monthlyKWh = bill / rate;
    const dailyKWh = monthlyKWh / 30;
    const dayUsageKWh = dailyKWh * dayUsageRatio;
    const solarKW = dayUsageKWh / avgSunHours / efficiency;
    const dailySolarKWh = solarKW * avgSunHours;
    const monthlySolarKWh = dailySolarKWh * 30;
    const savedBill = monthlySolarKWh * rate;
    const percentSaved = (savedBill / bill) * 100;
    const remainingBill = bill - savedBill;

    const systemSizes = [
        { kw: 3, watt: 3240 }, { kw: 3.5, watt: 3780 }, { kw: 4, watt: 4320 },
        { kw: 5, watt: 5400 }, { kw: 6, watt: 6480 }, { kw: 8, watt: 8640 },
        { kw: 10, watt: 10800 }, { kw: 15, watt: 16200 }, { kw: 20, watt: 21600 },
        { kw: 30, watt: 32400 }, { kw: 40, watt: 43200 }, { kw: 50, watt: 54000 },
        { kw: 60, watt: 64800 }, { kw: 70, watt: 75600 }, { kw: 80, watt: 86400 },
        { kw: 90, watt: 97200 }, { kw: 100, watt: 108000 }
    ];

        const format = num => num.toLocaleString(undefined, { maximumFractionDigits: 2 });

    let recommendedKW = null;
    for (let i = 0; i < systemSizes.length; i++) {
        if (solarKW <= systemSizes[i].kw) {
            recommendedKW = systemSizes[i].kw;
            break;
        }
    }
    if (!recommendedKW) {
        recommendedKW = `<span style="color:red;"><b>❌ ขนาดระบบที่ต้องการมากกว่า 100kW</b> — กรุณาติดต่อผู้เชี่ยวชาญเพื่อประเมินเพิ่มเติม</span>`;
    }

let installationNote = "";

if (solarKW < 3) {
    installationNote = `<span style="color:red;"><b>❌ คำเตือน:</b> ขนาดระบบที่คำนวณได้ต่ำกว่า 3kW อาจไม่คุ้มค่าต่อการติดตั้ง</span><br>`;
} else {
    if (typeof recommendedKW === 'number') {
        installationNote += `<span style="color:green;">📌 <b>ขนาดระบบที่ควรติดตั้ง:</b> ${format(recommendedKW)} kW</span><br>`;
    } else {
        // ไม่ต้อง format เพราะเป็น HTML แล้ว
        installationNote = `${recommendedKW}<br>`;
    }
}


    const result = `
        <div class="results-box">
            <div><b>🔆 พลังงานที่ใช้:</b></div>
            ☀️ พลังงานใช้ช่วงกลางวัน (10:00–15:00): <b>${format(dayUsageKWh)}</b> kWh/วัน<br>
            ⚡️ พลังงานใช้รวมต่อวัน: <b>${format(dailyKWh)}</b> kWh/วัน<br>
            💡 ค่าไฟเดิมของลูกค้า: <b>${format(bill)}</b> บาท (${format(monthlyKWh)} หน่วย)<br><br>

            <div><b>⚙️ ขนาดระบบที่แนะนำ:</b></div>
            ✅ ขนาดระบบติดตั้งที่แนะนำ: <strong>${format(solarKW)}</strong> kW<br>
            ${installationNote}
            ☀️ ผลิตไฟเฉลี่ยต่อวัน (5 ชม.): <b>${format(dailySolarKWh)}</b> kWh<br>
            🔋 ผลิตไฟเฉลี่ยต่อเดือน: <b>${format(monthlySolarKWh)}</b> kWh<br><br>

            <div><b>💸 การประหยัดค่าไฟ:</b></div>
            📉 คิดเป็น % การลดค่าไฟ: <b>${format(percentSaved)}</b>%<br>
            📈 ค่าไฟลดลงจริง: <b>${format(savedBill)}</b> บาท/เดือน<br>
            💰 ค่าไฟที่เหลือต้องจ่าย: <b>${format(remainingBill)}</b> บาท/เดือน<br><br>

            <p style="color: green; font-size: 0.9em;">
                📌 หมายเหตุ: ประเมินจากพฤติกรรมใช้งานไฟฟ้าช่วงกลางวัน โดยผู้ใช้ระบุเปอร์เซ็นต์การใช้ไฟ (10:00–15:00) และถือว่าแสงแดดเฉลี่ย 5 ชม./วัน ระบบมีประสิทธิภาพ 80%
            </p>
            <p style="color: gray; font-size: 0.9em;">
                Remark: เป็นค่าประมาณที่ได้จากฐานข้อมูลจริง โดยรวมค่าความสูญเสียเฉลี่ยไว้แล้ว หากต้องการผลลัพธ์ที่แม่นยำและปรับตามสภาพแวดล้อมจริงของคุณ แนะนำให้ใช้การคำนวณแบบละเอียดด้านล่าง
            </p>
        </div>
    `;

    resultDiv.innerHTML = result;
}

function resetForm() {
    document.getElementById("monthlyBill").value = "";
    document.getElementById("dayUsagePercent").value = "";
    document.getElementById("results").innerHTML = "";
}


// SolarCalculation On-Grid v4.2 by mpplearning
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

const systemSizes = [
    { kw: 3, watt: 3240 },
    { kw: 3.5, watt: 3780 },
    { kw: 4, watt: 4320 },
    { kw: 5, watt: 5400 },
    { kw: 6, watt: 6480 },
    { kw: 8, watt: 8640 },
    { kw: 10, watt: 10800 },
    { kw: 15, watt: 16200 },
    { kw: 20, watt: 21600 },
    { kw: 30, watt: 32400 },
    { kw: 40, watt: 43200 },
    { kw: 50, watt: 54000 },
    { kw: 60, watt: 64800 },
    { kw: 70, watt: 75600 },
    { kw: 80, watt: 86400 },
    { kw: 90, watt: 97200 },
    { kw: 100, watt: 108000 }
];

function getRecommendedSystemSize(requiredKW) {
    for (let size of systemSizes) {
        if (requiredKW <= size.kw) return size;
    }
    return null;
}

document.addEventListener("DOMContentLoaded", () => {
    const monthlyBillInput = document.getElementById("monthlyBill");
    if (monthlyBillInput) {
        monthlyBillInput.addEventListener("input", function () {
            const raw = this.value.replace(/,/g, '');
            if (!isNaN(raw) && raw !== "") {
                this.value = parseFloat(raw).toLocaleString();
            } else if (raw === "") {
                this.value = "";
            }
        });
    }

    document.getElementById("calculateBtn")?.addEventListener("click", calculateOnGrid);
    document.getElementById("resetBtn")?.addEventListener("click", resetForm);

    const toggleBtn = document.getElementById("toggleDetailBtn");
    const detailSection = document.getElementById("detailedSection");
    if (toggleBtn && detailSection) {
        toggleBtn.addEventListener("click", () => {
            detailSection.style.display = (detailSection.style.display === "none" || detailSection.style.display === "") ? "block" : "none";
        });
    }

    const deviceSelectDay = document.getElementById("deviceSelect_day");
    const deviceSelectNight = document.getElementById("deviceSelect_night");

    for (let name in deviceOptions) {
        const optionDay = new Option(name, name);
        const optionNight = new Option(name, name);
        deviceSelectDay?.appendChild(optionDay);
        deviceSelectNight?.appendChild(optionNight);
    }
});

function addSelectedDevice(period) {
  const deviceSelect = document.getElementById(period === 'day' ? "deviceSelect_day" : "deviceSelect_night");
  const hourInput = document.getElementById(period === 'day' ? "deviceHoursDayHour" : "deviceHoursNightHour");
  const minInput = document.getElementById(period === 'day' ? "deviceHoursDayMin" : "deviceHoursNightMin");
  const errorEl = document.getElementById(period === 'day' ? "error_day" : "error_night");

  const selectedDevice = deviceSelect.value;
  const hours = parseFloat(hourInput.value) || 0;
  const minutes = parseFloat(minInput.value) || 0;
  const totalHours = hours + minutes / 60;

  const maxHours = period === 'day' ? 5 : 19;

  // ล้างข้อความก่อน
  errorEl.textContent = "";

  // เช็คค่าติดลบ
  if (hours < 0 || minutes < 0) {
    errorEl.textContent = "⛔ กรุณาอย่าใส่ค่าติดลบ";
    return;
  }

  // เช็คเกินชั่วโมงที่กำหนด
  if (totalHours > maxHours) {
    errorEl.textContent = `⚠️ ช่วงเวลา ${period === 'day' ? "10:00–15:00" : "15:01–09:59"} ใช้ได้ไม่เกิน ${maxHours} ชั่วโมง`;
    return;
  }

  if (!selectedDevice || totalHours <= 0) {
    errorEl.textContent = "⚠️ กรุณาเลือกอุปกรณ์และระบุระยะเวลาให้ถูกต้อง";
    return;
  }

  const power = deviceOptions[selectedDevice];
  const entry = { name: selectedDevice, watt: power, hour: totalHours };

  if (period === "day") devicesDay.push(entry);
  else devicesNight.push(entry);

  updateDeviceList(period);

  // เคลียร์ช่องกรอกหลังเพิ่ม
  deviceSelect.value = "";
  hourInput.value = "";
  minInput.value = "";
}



function updateDeviceList(time) {
    const listId = time === "day" ? "deviceList" : "nideviceList";
    const listEl = document.getElementById(listId);
    const data = time === "day" ? devicesDay : devicesNight;

    listEl.innerHTML = data.map((d, i) =>
        `<div>${d.name} - ${d.watt}W × ${d.hour.toFixed(2)} ชม. = ${(d.watt * d.hour).toFixed(2)} Wh
         <button onclick="removeDevice('${time}', ${i})">❌</button></div>`
    ).join("");
}

function removeDevice(time, index) {
    if (time === "day") devicesDay.splice(index, 1);
    else devicesNight.splice(index, 1);
    updateDeviceList(time);
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

    const calc = arr => arr.reduce((sum, d) => sum + (d.watt * d.hour), 0);
    const kWh = w => (w / 1000);
    const format = n => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

    const dayLoad = calc(devicesDay);
    const nightLoad = calc(devicesNight);
    const totalLoad = dayLoad + nightLoad;

    const totalBill = kWh(totalLoad) * 4.5 * 30;
    const rawRecommendedKW = kWh(dayLoad) / 5 / 0.8;
    const recommendedSystem = getRecommendedSystemSize(rawRecommendedKW);
    const savedBill = kWh(dayLoad) * 4.5 * 30;
    const remainingBill = totalBill - savedBill;
    const percentSaved = (savedBill / totalBill) * 100;

    let systemNote = "";
    if (!recommendedSystem) {
        systemNote = `<span style="color:red;"><b>❌ ขนาดระบบที่ต้องการเกิน 100kW</b> กรุณาติดต่อวิศวกรเพื่อประเมินระบบแบบพิเศษ</span><br>`;
    } else if (recommendedSystem.kw < 3) {
        systemNote = `<span style="color:orange;"><b>⚠️ ขนาดระบบต่ำกว่า 3kW</b> อาจไม่คุ้มค่าต่อการติดตั้ง</span><br>`;
    } else {
        systemNote = `<span style="color:green;"><b>✅ ขนาดระบบที่แนะนำ:</b> ${recommendedSystem.kw} kW (${recommendedSystem.watt} Watt)</span><br>`;
    }

    document.getElementById("resultArea").innerHTML = `
    <div class="results-box" style="line-height:1.2;">
        ☀️ พลังงานใช้ช่วงกลางวัน (10:00–15:00): <b>${format(kWh(dayLoad))}</b> kWh/วัน<br>
        🌙 พลังงานใช้ช่วงกลางคืน (15:01–09:59): <b>${format(kWh(nightLoad))}</b> kWh/วัน<br>
        🔋 พลังงานใช้รวมต่อวัน: <b>${format(kWh(totalLoad))}</b> kWh/วัน<br>
        📅 ค่าไฟโดยประมาณต่อเดือน: <b>${format(totalBill)}</b> บาท<br>
        ☀️ ขนาดระบบที่ควรติดตั้ง (ผลิตช่วงกลางวัน): <b>${format(rawRecommendedKW)}</b> kW<br>
        ${systemNote}<br>
        📉 ค่าไฟที่ลดได้: <b>${format(savedBill)}</b> บาท/เดือน<br>
        💰 ค่าไฟที่เหลือต้องจ่าย: <b>${format(remainingBill)}</b> บาท/เดือน<br>
        ⚡️ ลดค่าไฟได้ประมาณ: <b>${format(percentSaved)}</b>%<br>

        <p style="color: green; font-size: 0.9em;">
        หมายเหตุ: ประเมินโดยใช้ค่าไฟ 4.5 บาท/หน่วย แดดเฉลี่ย 5 ชม./วัน และประสิทธิภาพระบบ 80%</p>
    </div>`;
}


function resetFormLoad(type) {
    if (type === 'day') {
        document.getElementById("deviceSelect_day").value = "";
        document.getElementById("deviceHoursDayHour").value = "";
        document.getElementById("deviceHoursDayMin").value = "";
        document.getElementById("error_day").textContent = "";
        devicesDay = [];
        updateDeviceList('day');
    } else {
        document.getElementById("deviceSelect_night").value = "";
        document.getElementById("deviceHoursNightHour").value = "";
        document.getElementById("deviceHoursNightMin").value = "";
        document.getElementById("error_night").textContent = "";
        devicesNight = [];
        updateDeviceList('night');
    }
}

function clearTotalLoad() {
    devicesDay = [];
    devicesNight = [];
    document.getElementById("deviceList").innerHTML = "";
    document.getElementById("nideviceList").innerHTML = "";
    document.getElementById("resultArea").innerHTML = "";
}
