import AttendanceLogs from "../../models/attendace_log.model.js";
import { Op } from "sequelize";

const clockIn = async (req, res) => {
  try {
    const userId = req.id;
    const currentDate = new Date();

    const logExists = await AttendanceLogs.findOne({
      where: { id: userId, logDate: currentDate.toISOString().split('T')[0] }
    });

    if (!logExists) {
      return res.status(400).json({
        status: 400,
        message: "Clock in not allowed"
      });
    }

    if (logExists.clockInTime) {
      return res.status(400).json({
        status: 400,
        message: "You have already clocked in for the day"
      });
    }

    logExists.clockInTime = currentDate;
    await logExists.save();
    
    return res.status(200).json({
      status: 200,
      message: "Clock in successful"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Error while processing your request"
    });
  }
}

const clockOut = async (req, res) => {
  try {
    const userId = req.id;
    const currentDate = new Date();

    const logExists = await AttendanceLogs.findOne({
      where: { userId, logDate: currentDate.toISOString().split('T')[0] },
    });

    if (!logExists || logExists.clockOutTime) {
      return res.status(400).json({
        status: 400,
        message: "Clock out not allowed"
      });
    }

    if (!logExists.clockInTime) {
      return res.status(400).json({
        status: 400,
        message: "You must clock in before clocking out"
      });
    }

    logExists.clockOutTime = currentDate;
    await existingLog.save();

    return res.status(200).json({
      status: 200,
      message: "Clock out successful"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Error while processing your request"
    });
  }
}

const getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.id;
    const { monthAndYear, page, pageSize } = req.query;

    const [year, month] = monthAndYear.split('-');

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const attendanceLogs = await AttendanceLogs.findAndCountAll({
      where: {
        userId,
        logDate: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      },
      order: [['logDate', 'ASC']],
      limit: parseInt(pageSize),
      offset: (parseInt(page) - 1) * parseInt(pageSize)
    });

    const totalPages = Math.ceil(attendanceLogs.count / pageSize);

    return res.status(200).json({
      status: 200,
      message: "Attendance history retrieved successfully",
      data: {
        attendanceLogs: attendanceLogs.rows,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Error while processing your request"
    });
  }
};

export default { clockIn, clockOut, getAttendanceHistory }