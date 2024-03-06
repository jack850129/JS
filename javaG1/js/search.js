document.addEventListener('DOMContentLoaded', function () {
    // 在網頁載入完成後觸發
    fetchData();
});

async function fetchData() {
    try {
        var name = document.getElementById('queryInput').value;
        var category = document.getElementById('categorySelect').value;
        var apiUrl = 'http://tejdemo.ddns.net/api/g2/' + category + '/' + name;

        var response = await fetch(apiUrl);
        var data = await response.json();

        displayResult(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function displayResult(data) {
    var container = document.getElementById('container');
    container.innerHTML = '';
    container.classList.add('flex-container'); // 添加 CSS 类

    var customOrder = ['cookbookName', 'cookbookDesc', 'cookTime', 'serving'];

    for (const item of data) {
        // 將 leftBlock 添加到 .left-block 中
        var leftBlock = document.createElement('div');
        leftBlock.classList.add('left-block');
        // 新增一個區塊來顯示 fetchAndDisplayChefBlock 的資料
        var chefBlock = await createChefBlock(item.chefID);
        leftBlock.appendChild(chefBlock);

        var jsonBlock = createJsonBlock(item, customOrder);
        var likeInfoElement = createLikeInfoElement(item);

        leftBlock.appendChild(jsonBlock);
        leftBlock.appendChild(likeInfoElement);

        // 將 rightBlock 添加到 .right-block 中
        var rightBlock = document.createElement('div');
        rightBlock.classList.add('right-block');


        // 使用 await 等待 fetchAndDisplayRightBlock 完成，並將 rightBlock 添加內容到 right-block 中
        await fetchAndDisplayRightBlock(item.cookbookID, rightBlock);

        // 新增一個區塊來顯示 fetchAndDisplayingBlock 的資料
        var ingBlock = await createIngBlock(item.cookbookID);
        rightBlock.appendChild(ingBlock);

        // 使用 insertBefore 方法將 ingBlock 插入到 rightBlock 中的第一個子元素之前
        rightBlock.insertBefore(ingBlock, rightBlock.firstChild);
        // 將 leftBlock、rightBlock 添加到 container 中
        container.appendChild(leftBlock);
        container.appendChild(rightBlock);
    }
}

function createJsonBlock(item, customOrder) {
    var jsonBlock = document.createElement('div');
    jsonBlock.classList.add('json-container', 'json-item');

    customOrder.forEach(key => {
        if (item.hasOwnProperty(key)) {
            var blockSeparator = document.createElement('hr');
            blockSeparator.classList.add('block-separator');

            var titleElement = document.createElement('div');
            titleElement.classList.add('title');
            titleElement.innerText = getCustomTitle(key);

            var contentElement = document.createElement('div');
            contentElement.classList.add('content');
            contentElement.innerText = item[key] || item[key] === 0 ? item[key] : '無';

            jsonBlock.appendChild(blockSeparator);
            jsonBlock.appendChild(titleElement);
            jsonBlock.appendChild(contentElement);
        }
    });

    return jsonBlock;
}

function createLikeInfoElement(item) {
    var likeInfoElement = document.createElement('div');
    likeInfoElement.classList.add('like-info');

    ['loveTag', 'tastyTag', 'goodTag'].forEach(tag => {
        var tagElement = document.createElement('div');
        tagElement.classList.add('tag');

        var titleElement = document.createElement('div');
        titleElement.classList.add('title');
        titleElement.innerText = getCustomLikeTitle(tag);

        var contentElement = document.createElement('div');
        contentElement.classList.add('content');
        contentElement.innerText = item[tag] || item[tag] === 0 ? item[tag] : '無';

        tagElement.appendChild(titleElement);
        tagElement.appendChild(contentElement);

        likeInfoElement.appendChild(tagElement);
    });

    return likeInfoElement;
}

function getCustomTitle(key) {
    switch (key) {
        case 'cookbookDesc':
            return '食譜簡介';
        case 'cookbookName':
            return '食譜名稱';
        case 'cookTime':
            return '烹飪時間';
        case 'chefName':
            return '廚師名稱';
        case 'chefAccount':
            return '帳號';
        case 'chefDesc':
            return '介紹';
        case 'chefLocal':
            return '位置';
        case 'serving':
            return '食譜份量';
        default:
            return '';
    }
}

function getCustomLikeTitle(tag) {
    switch (tag) {
        case 'loveTag':
            return '愛心次數';
        case 'tastyTag':
            return '好吃次數';
        case 'goodTag':
            return '按讚次數';
        default:
            return '';
    }
}

async function fetchAndDisplayRightBlock(cookbookID, rightBlock) {
    var rightBlockApiUrl = 'http://tejdemo.ddns.net/api/g2/cookbook/steps/' + cookbookID;

    try {
        var response = await fetch(rightBlockApiUrl);
        var rightBlockData = await response.json();

        var customOrder = ['stepDesc'];

        var titleElement = document.createElement('div');
        titleElement.classList.add('title');
        titleElement.innerText = '食譜步驟';
        rightBlock.appendChild(titleElement);

        rightBlockData.forEach(item => {
            customOrder.forEach(key => {
                if (item.hasOwnProperty(key)) {
                    var blockSeparator = document.createElement('hr');
                    blockSeparator.classList.add('block-separator');

                    var contentElement = document.createElement('div');
                    contentElement.classList.add('content');
                    contentElement.innerText = item[key] || item[key] === 0 ? item[key] : '無';

                    rightBlock.appendChild(blockSeparator);
                    rightBlock.appendChild(contentElement);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching right block data:', error);
    }
}

async function createIngBlock(cookbookID) {
    // 創建左側區塊
    var ingBlock = document.createElement('div');
    ingBlock.classList.add('ing-block');

    // 使用 fetchAndDisplayChefBlock 取得資料
    await fetchAndDisplayingBlock(cookbookID, ingBlock);

    return ingBlock;
}

async function fetchAndDisplayingBlock(cookbookID, ingBlock) {
    var ingBlockApiUrl = 'http://tejdemo.ddns.net/api/g2/cookbook/ingredients/' + cookbookID;

    try {
        var response = await fetch(ingBlockApiUrl);
        var ingBlockData = await response.json();

        var customOrder = ['ingredientDesc'];

        var titleElement = document.createElement('div');
        titleElement.classList.add('title');
        titleElement.innerText = '所需食材';
        ingBlock.appendChild(titleElement);

        ingBlockData.forEach(item => {
            customOrder.forEach(key => {
                if (item.hasOwnProperty(key)) {
                    var blockSeparator = document.createElement('hr');
                    blockSeparator.classList.add('block-separator');

                    var contentElement = document.createElement('div');
                    contentElement.classList.add('content');
                    contentElement.innerText = item[key] || item[key] === 0 ? item[key] : '無';

                    ingBlock.appendChild(blockSeparator);
                    ingBlock.appendChild(contentElement);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching ing block data:', error);
    }
}

async function createChefBlock(chefID) {
    // 創建左側區塊
    var chefBlock = document.createElement('div');
    chefBlock.classList.add('chef-block');

    // 使用 fetchAndDisplayChefBlock 取得資料
    await fetchAndDisplayChefBlock(chefID, chefBlock);

    return chefBlock;
}

async function fetchAndDisplayChefBlock(chefID, chefBlock) {
    var chefBlockApiUrl = 'http://tejdemo.ddns.net/api/g2/chelfid/' + chefID;

    try {
        var response = await fetch(chefBlockApiUrl);
        var chefBlockData = await response.json();

        var customOrder = ['chefName', 'chefAccount', 'chefDesc', 'chefLocal'];

        chefBlockData.forEach(item => {
            customOrder.forEach(key => {
                if (item.hasOwnProperty(key)) {
                    var blockSeparator = document.createElement('hr');
                    blockSeparator.classList.add('block-separator');

                    var titleElement = document.createElement('div');
                    titleElement.classList.add('title');
                    titleElement.innerText = getCustomTitle(key);

                    var contentElement = document.createElement('div');
                    contentElement.classList.add('content');
                    contentElement.innerText = item[key] || item[key] === 0 ? item[key] : '無';

                    chefBlock.appendChild(blockSeparator);
                    chefBlock.appendChild(titleElement);
                    chefBlock.appendChild(contentElement);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching chef block data:', error);
    }
}

// 在這裡新增一個函數，以執行初始化隨機食譜的操作
async function initRandomRecipe() {
    try {
        // 在這裡構建你的 API 端點和查詢條件
        var apiUrl = 'http://tejdemo.ddns.net/api/g2/category/雞肉';

        // 發送 API 請求
        var response = await fetch(apiUrl);
        var data = await response.json();

        // 處理返回的資料，可能是呈現在頁面上
        displayResult(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// 在初始化時呼叫此函數
initRandomRecipe();