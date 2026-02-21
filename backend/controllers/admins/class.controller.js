const Class = require("../../models/class.model");

// Create Class
exports.createClass = async (req, res) => {
  try {
    const { className, section, academicYear, classTeacher } = req.body;

    if (!className || !section || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "className, section and academicYear are required",
      });
    }

    const newClass = await Class.create({
      className,
      section,
      academicYear,
      classTeacher,
    });

    res.status(201).json({
      success: true,
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};