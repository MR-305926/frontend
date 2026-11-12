//@ts-check

/**
 * @param {number} width
 */
function genColumnTemplate(width) {
	let ans = "auto";
	for (let i = 1; i < width; i++) {
		ans += " auto";
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
		cells.push(<div key={header} className="tableHeader">{header}</div>);
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
 * @param {Object} props
 * @param {{[k:string]:any}[]} props.content
 */
function Table({ content }) {
	//TODO => IMPLEMENT
	if (content.length > 0) {

		let headers = Object.keys(content[0]);
		let templateColumns = genColumnTemplate(headers.length);
		let cells = genCells(headers, content);

		return (
			<div className="table" style={{ display: 'grid', gridTemplateColumns: templateColumns }}>
				{cells}
			</div >
		);
	}
	return (<></>)
}

export default Table;