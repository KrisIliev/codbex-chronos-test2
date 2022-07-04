var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");
var EntityUtils = require("chronos-app/gen/dao/utils/EntityUtils");

var dao = daoApi.create({
	table: "CHRONOS_ASSIGNMENT",
	properties: [
		{
			name: "Id",
			column: "ASSIGNMENT_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "EmployeeId",
			column: "ASSIGNMENT_EMPLOYEEID",
			type: "INTEGER",
		}, {
			name: "ProjectId",
			column: "ASSIGNMENT_PROJECTID",
			type: "INTEGER",
		}, {
			name: "Start",
			column: "ASSIGNMENT_START",
			type: "DATE",
		}, {
			name: "End",
			column: "ASSIGNMENT_END",
			type: "DATE",
		}]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setLocalDate(e, "Start");
		EntityUtils.setLocalDate(e, "End");
		return e;
	});
};

exports.get = function(id) {
	var entity = dao.find(id);
	EntityUtils.setLocalDate(entity, "Start");
	EntityUtils.setLocalDate(entity, "End");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "Start");
	EntityUtils.setLocalDate(entity, "End");
	var id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CHRONOS_ASSIGNMENT",
		key: {
			name: "Id",
			column: "ASSIGNMENT_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	EntityUtils.setLocalDate(entity, "Start");
	EntityUtils.setLocalDate(entity, "End");
	dao.update(entity);
	triggerEvent("Update", {
		table: "CHRONOS_ASSIGNMENT",
		key: {
			name: "Id",
			column: "ASSIGNMENT_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CHRONOS_ASSIGNMENT",
		key: {
			name: "Id",
			column: "ASSIGNMENT_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM CHRONOS_ASSIGNMENT");
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("chronos-app/Employees/Assignment/" + operation).send(JSON.stringify(data));
}