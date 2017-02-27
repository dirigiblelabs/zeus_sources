/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();
var sourcesDaoExtensionsUtils = require('zeus/sources/utils/sourcesDaoExtensionUtils');
var user = require("net/http/user");

// Create an entity
exports.create = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'INSERT INTO ZEUS_SOURCES (SCM_ID,SCM_NAME,SCM_URL,SCM_PROJECT_ID,SCM_CREATED_AT,SCM_CREATED_BY) VALUES (?,?,?,?,?,?)';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('ZEUS_SOURCES_SCM_ID').next();
        statement.setInt(++i, id);
        statement.setString(++i, entity.scm_name);
        statement.setString(++i, entity.scm_url);
        statement.setInt(++i, entity.scm_project_id);
        statement.setTimestamp(++i, new Date());
        statement.setString(++i, user.getName());
		sourcesDaoExtensionsUtils.beforeCreate(connection, entity);
        statement.executeUpdate();
        sourcesDaoExtensionsUtils.afterCreate(connection, entity);
    	return id;
    } finally {
        connection.close();
    }
};

// Return a single entity by Id
exports.get = function(id) {
	var entity = null;
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT * FROM ZEUS_SOURCES WHERE SCM_ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, id);

        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            entity = createEntity(resultSet);
        }
    } finally {
        connection.close();
    }
    return entity;
};

// Return all entities
exports.list = function(limit, offset, sort, desc) {
    var result = [];
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT ';
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genTopAndStart(limit, offset);
        }
        sql += ' * FROM ZEUS_SOURCES';
        if (sort !== null) {
            sql += ' ORDER BY ' + sort;
        }
        if (sort !== null && desc !== null) {
            sql += ' DESC ';
        }
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
    } finally {
        connection.close();
    }
    return result;
};

// Update an entity by Id
exports.update = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'UPDATE ZEUS_SOURCES SET   SCM_NAME = ?, SCM_URL = ?, SCM_PROJECT_ID = ? WHERE SCM_ID = ?';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, entity.scm_name);
        statement.setString(++i, entity.scm_url);
        statement.setInt(++i, entity.scm_project_id);
        statement.setInt(++i, entity.scm_id);
		sourcesDaoExtensionsUtils.beforeUpdate(connection, entity);
        statement.executeUpdate();
        sourcesDaoExtensionsUtils.afterUpdate(connection, entity);
    } finally {
        connection.close();
    }
};

// Delete an entity
exports.delete = function(entity) {
    var connection = datasource.getConnection();
    try {
    	var sql = 'DELETE FROM ZEUS_SOURCES WHERE SCM_ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setString(1, entity.scm_id);
        sourcesDaoExtensionsUtils.beforeDelete(connection, entity);
        statement.executeUpdate();
        sourcesDaoExtensionsUtils.afterDelete(connection, entity);
    } finally {
        connection.close();
    }
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM ZEUS_SOURCES';
        var statement = connection.prepareStatement(sql);
        var rs = statement.executeQuery();
        if (rs.next()) {
            count = rs.getInt(1);
        }
    } finally {
        connection.close();
    }
    return count;
};

// Returns the metadata for the entity
exports.metadata = function() {
	var metadata = {
		name: 'zeus_sources',
		type: 'object',
		properties: [
		{
			name: 'scm_id',
			type: 'integer',
			key: 'true',
			required: 'true'
		},
		{
			name: 'scm_name',
			type: 'string'
		},
		{
			name: 'scm_url',
			type: 'string'
		},
		{
			name: 'scm_project_id',
			type: 'integer'
		},
		{
			name: 'scm_created_at',
			type: 'timestamp'
		},
		{
			name: 'scm_created_by',
			type: 'string'
		},
		]
	};
	return metadata;
};

// Create an entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
	result.scm_id = resultSet.getInt('SCM_ID');
    result.scm_name = resultSet.getString('SCM_NAME');
    result.scm_url = resultSet.getString('SCM_URL');
	result.scm_project_id = resultSet.getInt('SCM_PROJECT_ID');
    if (resultSet.getTimestamp('SCM_CREATED_AT') !== null) {
        result.scm_created_at = new Date(resultSet.getTimestamp('SCM_CREATED_AT').getTime());
    } else {
        result.scm_created_at = null;
    }
    result.scm_created_by = resultSet.getString('SCM_CREATED_BY');
    return result;
}

