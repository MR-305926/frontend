//@ts-check

import PaginationState from "../utils/PaginationState";

/**
 * @param {Object} props
 * @param {import("../utils/PaginationState").default} props.paginationState
 * @param {(value:import("../utils/PaginationState").default) => void} props.updatePaginationState
 * @param {boolean} props.linkPanelDisplayState
 * @param {() => void} props.toggleLinkPanel
 * @param {boolean} props.formDisplayState
 * @param {() => void} props.toggleForm
 */
function DashboardNav({ paginationState: paginationState, updatePaginationState: updatePaginationState, linkPanelDisplayState, toggleLinkPanel, formDisplayState, toggleForm }) {
	/**
	 * @param {import("react").ChangeEvent<HTMLInputElement, HTMLInputElement>} event
	 */
	function updatePageIndex(event) {
		updatePaginationState(new PaginationState(paginationState.pageSize, event.target.valueAsNumber));
	}

	/**
	 * @param {import("react").ChangeEvent<HTMLInputElement, HTMLInputElement>} event
	 */
	function updatePageSize(event) {
		updatePaginationState(new PaginationState(event.target.valueAsNumber, paginationState.pageIndex));
	}

	function pageIndexForward() {
		updatePaginationState(new PaginationState(
			paginationState.pageSize,
			paginationState.pageIndex + 1
		));
	}

	function pageIndexBackward() {
		updatePaginationState(new PaginationState(
			paginationState.pageSize,
			paginationState.pageIndex > 1 ? paginationState.pageIndex - 1 : 1
		));
	}

	return (
		<nav>
			<button id="toggleAside" onClick={toggleLinkPanel}>{linkPanelDisplayState ? "<" : ">"}</button>
			{/*
			<div>
				<button onClick={pageIndexBackward}>{"⇐"}</button>

				<input name="pageIndex" type="number" min={1} value={paginationState.pageIndex} onChange={updatePageIndex} />
				<label htmlFor="pageCount">#</label>
				<input name="pageCount" type="number" min={1} value={paginationState.pageSize} onChange={updatePageSize} />

				<button onClick={pageIndexForward}>{"⇒"}</button>
			</div>
			*/}
			<button id="toggleForm" onClick={toggleForm}>{formDisplayState ? ">" : "<"}</button>
		</nav>
	);
}


export default DashboardNav;