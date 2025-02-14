const express = require('express')
const router = express.Router()
const employeesController = require('../../controllers/employeeController')
const rolesList = require('../../config/role_list')
const verifyRoles = require('../../middleware/verifyRoles')
const ROLES_LIST = require('../../config/role_list')

router
  .route('/')
  .get(employeesController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee)
router.route('/:id').get(employeesController.getEmployee)
module.exports = router
