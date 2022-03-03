const groupBy = (array, width, height) => {
    let result = [];
    let row = [];
    array.forEach((item, index) => {
        if (index % width === 0) {
            result.push(row);
            row = [];
        }
        row.push(item - 1);
    });
    return result.splice(1);
}

export { groupBy };