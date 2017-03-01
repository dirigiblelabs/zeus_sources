/* globals $ */
/* eslint-env node, dirigible */

const PATH = "/sources";
const HTML_LINK = "../sources/index.html";

//exports.getMenuItem = function() {
//	return {  
//      "name": "Sources",
//      "path": PATH,
//      "link": HTML_LINK
//   };
//};

exports.getSidebarItem = function() {
	return {  
      "name": "Sources",
      "path": PATH,
      "link": HTML_LINK,
      "category": "Develop",
      "order": 203
   };
};
