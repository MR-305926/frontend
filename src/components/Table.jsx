//@ts-check

/**
 * @param {number} width
 */
function genColumnTemplate(width) {
	let ans = "1fr";
	for (let i = 1; i < width; i++) {
		ans += " 1fr";
	}
	return ans;
}

/**
 * @param {string[]} headers
 * @param {{ [k: string]: any }[]} content
 */
function genCells(headers, content) {

	let cells = [];
	for (let header of headers) {
		cells.push(<div key={header} className="tableHeader tableCell">{header}</div>);
	}
	let buffer;
	/** @type {string} */
	let value;
	let index = 0;
	for (let item of content) {
		for (let header of headers) {
			buffer = item[header];
			if (buffer == undefined || buffer == null) {
				value = "";
			} else {
				value = buffer.toString();
			}
			cells.push(<div key={[header, index].join()} className="tableCell">{value}</div>)
		}
		index++;
	}

	return (<>{cells}</>);
}

/**
 * @param {{[header:string]:string}} headerAlias
 * @param {string[]} headers
 * @param {{[k:string]:any}[]} content
 */
function betterGenCells(headerAlias, headers, content) {
	let cells = [];

	//headers
	{
		let alias;
		for (let header of headers) {
			try {
				alias = headerAlias[header];
			} catch (e) { alias = undefined; }
			cells.push(<div key={header} className="tableHeader tableCell">{alias ?? header}</div>);
		}
	}
	//body
	{
		let buffer;
		/** @type {string} */
		let value;
		let rowIndex = 0;
		for (let item of content) {
			for (let columnIndex of headers) {
				buffer = item[columnIndex];
				if (buffer == undefined || buffer == null) {
					value = "";
				} else {
					value = buffer.toString();
				}
				cells.push(<div key={[columnIndex, rowIndex].join()} className="tableCell">{value}</div>);
			}
			rowIndex++;
		}
	}

	return (<>{cells}</>);
}

/**
 * @param {Object} props
 * @param {{[k:string]:any}[]} props.content
 * @param {{[header:string]:string}} props.headersAlias
 */
function Table({ headersAlias, content }) {
	//TODO => IMPLEMENT
	if (content.length > 0) {

		let headers = Object.keys(content[0]);
		let templateColumns = genColumnTemplate(headers.length);
		let cells = betterGenCells(headersAlias, headers, content);

		return (
			<div className="table" style={{ display: 'grid', gridTemplateColumns: templateColumns }}>
				{cells}
			</div >
		);
	}
	return (<></>)
}

export default Table;