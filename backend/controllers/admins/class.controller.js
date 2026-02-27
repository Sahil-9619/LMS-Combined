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

exports.getClassById = async (req, res) => {   
  try {
    const classId = req.params.id;
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }
    res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllClasses = async (req, res) => {

  try {
    const classes = await Class.find();
    res.status(200).json({    
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};  

exports.updateClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const updatedClass = await Class.find
ByIdAndUpdate(classId, req.body, { new: true });
    if (!updatedClass) {
      return res.status(404).json({
        success: false, 
        message: "Class not found",
      });
    } 
    res.status(200).json({
      success: true,
      data: updatedClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  } 
};

exports.deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const deletedClass = await Class.findByIdAndDelete(classId);  
    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  }
    catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } 
};



