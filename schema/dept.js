const mongoose = require('mongoose');
const schema = mongoose.Schema;

const DepartmentSchema = new schema({
    deptId: String,
    deptName: String,
    deptAddress: String,
    univId: String
});

const Department = mongoose.model('department', DepartmentSchema);
module.exports = Department;