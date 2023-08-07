import AttendanceLogs from "../../models/attendace_log.model.js";
import Salaries from "../../models/salaries.model.js";
import { Op } from "sequelize";
import Users from "../../models/users.model.js";

const getPayrollReportMonthly = async (req, res) => {
  try {
    const { monthAndYear } = req.query;
    const [year, month] = monthAndYear.split('-');
    const userId = req.id;

    const employee = await Users.findByPk(userId);

    if (!employee) {
      return res.status(404).json({
        status: 404,
        message: "Employee not found"
      });
    }

    const salary = await Salaries.findOne({
      where: {
        userId: userId
      }
    });

    if (!salary) {
      return res.status(404).json({
        status: 404,
        message: "Salary information not found"
      });
    }

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    const attendanceLogs = await AttendanceLogs.findAll({
      where: {
        userId: userId,
        logDate: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    const payrollReport = attendanceLogs.map(log => {
      const reportItem = {
        date: log.logDate,
        regularHours: 0,
        totalHours: 0,
        deductions: 0,
        deductionDescription: ''
      };

      if (log.clockInTime && log.clockOutTime) {
        const hoursWorked = (log.clockOutTime - log.clockInTime) / (1000 * 60 * 60);
        reportItem.totalHours = hoursWorked;

        if (hoursWorked >= 8) {
          reportItem.regularHours = 8;
        } else {
          reportItem.regularHours = hoursWorked;
        }
      }

      if (!log.clockInTime && !log.clockOutTime) {
        reportItem.deductions = parseInt(salary.salary);
        reportItem.deductionDescription = 'One day deduction';
      } else if (log.clockInTime && !log.clockOutTime) {
        reportItem.deductions = parseInt(salary.salary) / 2;
        reportItem.deductionDescription = 'Half day deduction';
      }

      return reportItem;
    });

    const totalDeductions = payrollReport.reduce((total, item) => total + parseInt(item.deductions, 10), 0);
    const netSalary = salary.salary - totalDeductions;

    return res.status(200).json({
      status: 200,
      message: "Payroll report generated successfully",
      payrollReport: payrollReport,
      basicSalary: parseInt(salary.salary),
      totalDeductions: totalDeductions,
      netSalary: netSalary < 0 ? 0 : netSalary
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Error while generating payroll report"
    });
  }
};

export default { getPayrollReportMonthly }