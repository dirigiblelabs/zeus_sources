/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();

// Return all entities
exports.list = function(limit, offset, sort, desc) {
    var result = [];
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT ';
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genTopAndStart(limit, offset);
        }
        sql += ' * FROM ZEUS_SOURCES_VIEW';
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

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM ZEUS_SOURCES_VIEW';
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
		name: 'zeus_sources_view',
		type: 'object',
		properties: [
		{
			name: 'scm_id',
			type: 'integer'
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
			name: 'project_name',
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
    result.project_name = resultSet.getString('PROJECT_NAME');
    return result;
}

