// script.js
function calculatePayback() {
  const systemSize = parseFloat(document.getElementById("systemSize").value);
  const installationCost = parseFloat(document.getElementById("installationCost").value);
  const electricityRate = parseFloat(document.getElementById("electricityRate").value);
  const sunHours = parseFloat(document.getElementById("sunHours").value);

  const daysInMonth = 30;
  const kWhPerDay = systemSize * sunHours;
  const kWhPerMonth = kWhPerDay * daysInMonth;
  const monthlySavings = kWhPerMonth * electricityRate;
  const paybackYears = installationCost / (monthlySavings * 12);

  document.getElementById("monthlyProduction").textContent = `ระบบผลิตไฟได้ประมาณ ${kWhPerMonth.toFixed(2)} หน่วย/เดือน`;
  document.getElementById("monthlySavings").textContent = `ประหยัดค่าไฟได้ประมาณ ${monthlySavings.toFixed(2)} บาท/เดือน`;
  document.getElementById("paybackPeriod").textContent = `คาดว่าจะคืนทุนภายในประมาณ ${paybackYears.toFixed(1)} ปี`;
}