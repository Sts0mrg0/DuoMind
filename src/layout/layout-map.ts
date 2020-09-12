import Topic from 'topic';
import Layout from './layout';

class MapLayout extends Layout {
	update(root: Topic) {
		this.layoutRoot(root);

		// setTimeout(() => this.layoutRoot(root), 0);
		// this.layoutRoot(root);
		// this.layoutRoot(root);
		// this.drawConnections(root);
	}

	layoutRoot(root: Topic) {
		const LRSplitIndex = Math.floor(root.children.length / 2);
		const rightChildren = root.children.slice(0, LRSplitIndex);
		const leftChildren = root.children.slice(
			LRSplitIndex,
			root.children.length
		);

		let LWidth = 0,
			LHeight = 0,
			RWidth = 0,
			RHeight = 0,
			LBBoxes = [],
			RBBoxes = [];

		for (let i = 0; i < rightChildren.length; i++) {
			const verticalGap = i == 0 ? 0 : this.verticalGap;
			const bbox = this.layoutTopic(rightChildren[i], 'right');
			RWidth = Math.max(RWidth, bbox[0]);
			RHeight += verticalGap + bbox[1]; // need to add vertical
			RBBoxes.push(bbox);
		}

		for (let i = 0; i < leftChildren.length; i++) {
			const verticalGap = i == 0 ? 0 : this.verticalGap;
			let bbox = this.layoutTopic(leftChildren[i], 'left');
			LWidth = Math.max(LWidth, bbox[0]);
			LHeight += verticalGap + bbox[1]; // need to add vertical
			LBBoxes.push(bbox);
		}

		const topicBox = root.getBox();
		console.log(topicBox);
		// debugger;
		// calculate bbox
		const bboxWidth =
			topicBox[0] + LWidth + RWidth + this.horizontalGap * 2;
		const bboxHeight = Math.max(topicBox[1], RHeight, LHeight);

		// update bbox cache
		this.bBoxes[root.id] = [bboxWidth, bboxHeight];

		// position topicEl
		root.topicEl.style.left = LWidth + this.horizontalGap + 'px';
		root.topicEl.style.top = bboxHeight / 2 - topicBox[1] / 2 + 'px';

		// position right children
		let offsetTop = (bboxHeight - RHeight) / 2;
		for (let i = 0; i < rightChildren.length; i++) {
			const verticalGap = i == 0 ? 0 : this.verticalGap;
			const child = rightChildren[i];
			child.dom.style.left =
				LWidth + this.horizontalGap * 2 + topicBox[0] + 'px';
			child.dom.style.top = verticalGap + offsetTop + 'px';
			offsetTop += verticalGap + RBBoxes[i][1];
		}

		// position left children
		offsetTop = (bboxHeight - LHeight) / 2;
		for (let i = 0; i < leftChildren.length; i++) {
			const verticalGap = i == 0 ? 0 : this.verticalGap;
			const child = leftChildren[i];
			child.dom.style.right =
				RWidth + this.horizontalGap * 2 + topicBox[0] + 'px';
			+'px';
			child.dom.style.top = verticalGap + offsetTop + 'px';
			offsetTop += verticalGap + LBBoxes[i][1];
		}

		// set dimensions
		root.dom.style.width = bboxWidth + 'px';
		root.dom.style.height = bboxHeight + 'px';
		root.childrenContainer.style.width = bboxWidth + 'px';
		root.childrenContainer.style.height = bboxHeight + 'px';
		return [bboxWidth, bboxHeight];
	}
}

export default MapLayout;