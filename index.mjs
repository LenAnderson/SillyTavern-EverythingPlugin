import { Router } from 'express';
import { jsonParser } from '../../src/express-common.js';
import { createRequire } from 'module';
const require  = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');




/**
 *
 * @param {Router} router
 */
export async function init(router) {
	router.get('/', jsonParser, (req, res)=>{
		const files = fs.readdirSync('./public', { withFileTypes:true, recursive:true })
			.filter(it=>!it.parentPath.startsWith('public\\lib'))
			.filter(it=>it.isFile() && it.name.endsWith('.js'))
			.map(it=>path.join(it.parentPath, it.name))
			.filter(it=>fs.readFileSync(it).includes('export'))
			.map(it=>it.slice('public'.length))
			.map(it=>it.replaceAll('\\', '/'))
		;
		res.send(files.join('\n'));
	});
}

export async function exit() {}

const module = {
    init,
    exit,
    info: {
        id: 'everything',
        name: 'Everything',
        description: '...',
    },
};
export default module;
