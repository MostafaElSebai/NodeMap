
export const createGroupId = (source, target) => {
    const groupId = [source, target].sort().join("-");
    return groupId
}