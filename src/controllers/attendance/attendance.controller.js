import AttendanceLogs from "../../models/attendace_log.model.js";

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

export default { clockIn, clockOut }