

/* asyncPool https://github.com/rxaviers/async-pool/blob/master/lib/es7.js */
async function asyncPool(poolLimit, array, iteratorFn) {
    const ret = [];
    const executing = [];
    for (const item of array) {
      const p = Promise.resolve().then(() => iteratorFn(item, array));
      ret.push(p);
  
      if (poolLimit <= array.length) {
        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);
        if (executing.length >= poolLimit) {
          await Promise.race(executing);
        }
      }
    }
    return Promise.all(ret);
  }


window.location.href = 'http://gs25.gsretail.com/gscvs/ko/store-services/locations#;';
const CSRFToken = ACC.config.CSRFToken;

fetch(`/gscvs/ko/store-services/locationList?CSRFToken=${CSRFToken}`, {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-gpc": "1",
        "x-requested-with": "XMLHttpRequest"
    },
    "body": `pageNum=1&pageSize=100&searchShopName=&searchSido=&searchGugun=&searchDong=&searchType=all&searchTypeService=0&searchTypeToto=0&searchTypeCafe25=0&searchTypeInstant=0&searchTypeDrug=0&searchTypeSelf25=0&searchTypePost=0&searchTypeATM=0&searchTypeWithdrawal=0&searchTypeTaxrefund=0&searchTypeSmartAtm=0&searchTypeSelfCookingUtensils=0&searchTypeDeliveryService=0`,
    "method": "POST",
    })
    .then(x => x.json())
        .then(x => JSON.parse(x))
        .then(x => x.pagination.numberOfPages)
        .then(lastPage => 
            asyncPool(3, [...Array(lastPage).keys()].map(x => x+1), async (page) => 
                fetch(`/gscvs/ko/store-services/locationList?CSRFToken=${CSRFToken}`, {
                    "headers": {
                        "accept": "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "sec-gpc": "1",
                        "x-requested-with": "XMLHttpRequest"
                    },
                    "body": `pageNum=${page}&pageSize=100&searchShopName=&searchSido=&searchGugun=&searchDong=&searchType=all&searchTypeService=0&searchTypeToto=0&searchTypeCafe25=0&searchTypeInstant=0&searchTypeDrug=0&searchTypeSelf25=0&searchTypePost=0&searchTypeATM=0&searchTypeWithdrawal=0&searchTypeTaxrefund=0&searchTypeSmartAtm=0&searchTypeSelfCookingUtensils=0&searchTypeDeliveryService=0`,
                    "method": "POST",
                    })
                    .then(x => x.json())
                    .then(x => JSON.parse(x))
                    .then(x => x.results)
                    .then(x => x.map(a => {return {
                                code: a.shopCode, 
                                name: a.shopName, 
                                address: a.address, 
                                lng: a.longs, 
                                lat: a.lat,
                            };
                        }
                    )
                )
            )
        )
        .then(x => x.flatMap(x => x))
        .then(list => {
            console.log(
                list.map(x => x.code + '\t' + x.name + '\t' + x.address + '\t' + x.lng + '\t' + x.lat + '\n').toString().replace(/^,/gm, '')
            );
            console.log('총 매장 수 : ', list.length); 
            console.log('위의 출력을 복사하고, 액셀에 붙이세요.');
        });