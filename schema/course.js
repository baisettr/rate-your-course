const mongoose = require('mongoose');
const schema = mongoose.Schema;

const CourseSchema = new schema({
    courseId: String,
    courseName: String,
    courseDesc: String,
    courseTerm: String,
    deptId: String
});

const Course = mongoose.model('course', CourseSchema);
module.exports = Course;