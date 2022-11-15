### 数组中拥有相同值的部分放在一起

JSON 数据如下：
```
[
  { "year": "A", "value": 0.216893, "type": "变压器", "column": "变压器" },
  { "year": "C", "value": 0.303514, "type": "列头柜(市电)", "column": "列头柜(市电)" },
  { "year": "B", "value": 0.520798, "type": "变压器", "column": "变压器" },
  { "year": "B", "value": 0.390492, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "G", "value": 0.11178, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "F", "value": 0.166115, "type": "市电", "column": "市电" },
  { "year": "C", "value": 0.147791, "type": "UPS", "column": "UPS" },
  { "year": "F", "value": 0.287865, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "E", "value": 0.272428, "type": "变压器", "column": "变压器" },
  { "year": "A", "value": 0.160973, "type": "UPS", "column": "UPS" },
  { "year": "G", "value": 0.07075, "type": "市电", "column": "市电" },
  { "year": "C", "value": 0.397284, "type": "变压器", "column": "变压器" },
  { "year": "A", "value": 0.276203, "type": "列头柜(市电)", "column": "列头柜(市电)" },
  { "year": "D", "value": 0.224585, "type": "HVDC", "column": "HVDC" },
  { "year": "G", "value": 0.068467, "type": "变压器", "column": "变压器" },
  { "year": "A", "value": 0.534316, "type": "市电", "column": "市电" },
  { "year": "H", "value": 0.220567, "type": "HVDC", "column": "HVDC" },
  { "year": "H", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "E", "value": 0.296573, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "C", "value": 0.247884, "type": "市电", "column": "市电" },
  { "year": "D", "value": 0.263069, "type": "市电", "column": "市电" },
  { "year": "H", "value": 0.136582, "type": "变压器", "column": "变压器" },
  { "year": "A", "value": 0.214627, "type": "列头柜(UPS)", "column": "列头柜(UPS)" },
  { "year": "F", "value": 0.228391, "type": "HVDC", "column": "HVDC" },
  { "year": "B", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "D", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "H", "value": 0, "type": "UPS", "column": "UPS" },
  { "year": "D", "value": 0.287525, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "H", "value": 0.139327, "type": "市电", "column": "市电" },
  { "year": "C", "value": 0.214243, "type": "HVDC", "column": "HVDC" },
  { "year": "E", "value": 0.341645, "type": "列头柜(市电)", "column": "列头柜(市电)" },
  { "year": "G", "value": 0.113145, "type": "HVDC", "column": "HVDC" },
  { "year": "E", "value": 0.117918, "type": "UPS", "column": "UPS" },
  { "year": "B", "value": 0.278456, "type": "HVDC", "column": "HVDC" },
  { "year": "E", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "G", "value": 0, "type": "UPS", "column": "UPS" },
  { "year": "F", "value": 0.176382, "type": "变压器", "column": "变压器" },
  { "year": "C", "value": 0.300014, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "A", "value": 0.25382, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "D", "value": 0.173778, "type": "UPS", "column": "UPS" },
  { "year": "H", "value": 0.220402, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "F", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "D", "value": 0.306388, "type": "列头柜(市电)", "column": "列头柜(市电)" },
  { "year": "B", "value": 0.324078, "type": "市电", "column": "市电" },
  { "year": "E", "value": 0.238933, "type": "HVDC", "column": "HVDC" },
  { "year": "F", "value": 0.08375, "type": "UPS", "column": "UPS" },
  { "year": "F", "value": 0.342799, "type": "列头柜(市电)", "column": "列头柜(市电)" },
  { "year": "B", "value": 0.251889, "type": "UPS", "column": "UPS" },
  { "year": "A", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "G", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "D", "value": 0.423935, "type": "变压器", "column": "变压器" },
  { "year": "B", "value": 0.40633, "type": "列头柜(市电)", "column": "列头柜(市电)" },
  { "year": "E", "value": 0.16701, "type": "市电", "column": "市电" },
  { "year": "A", "value": 0.193051, "type": "HVDC", "column": "HVDC" },
  { "year": "C", "value": 0, "type": "柴发", "column": "柴发" }
]
```
希望把数据变成如下格式：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/array2.png"/>

  实现代码如下：
```
import logo from './logo.svg';
import './App.css';
import React from 'react';

const tableData2 = [
  { "year": "A", "value": 0.216893, "type": "变压器", "column": "变压器" },
  { "year": "C", "value": 0.303514, "type": "列头柜(市电)", "column": "列头柜(市电)" },
  { "year": "B", "value": 0.520798, "type": "变压器", "column": "变压器" },
  { "year": "B", "value": 0.390492, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "G", "value": 0.11178, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "F", "value": 0.166115, "type": "市电", "column": "市电" },
  { "year": "C", "value": 0.147791, "type": "UPS", "column": "UPS" },
  { "year": "F", "value": 0.287865, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "E", "value": 0.272428, "type": "变压器", "column": "变压器" },
  { "year": "A", "value": 0.160973, "type": "UPS", "column": "UPS" },
  { "year": "G", "value": 0.07075, "type": "市电", "column": "市电" },
  { "year": "C", "value": 0.397284, "type": "变压器", "column": "变压器" },
  { "year": "A", "value": 0.276203, "type": "列头柜(市电)", "column": "列头柜(市电)" },
  { "year": "D", "value": 0.224585, "type": "HVDC", "column": "HVDC" },
  { "year": "G", "value": 0.068467, "type": "变压器", "column": "变压器" },
  { "year": "A", "value": 0.534316, "type": "市电", "column": "市电" },
  { "year": "H", "value": 0.220567, "type": "HVDC", "column": "HVDC" },
  { "year": "H", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "E", "value": 0.296573, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "C", "value": 0.247884, "type": "市电", "column": "市电" },
  { "year": "D", "value": 0.263069, "type": "市电", "column": "市电" },
  { "year": "H", "value": 0.136582, "type": "变压器", "column": "变压器" },
  { "year": "A", "value": 0.214627, "type": "列头柜(UPS)", "column": "列头柜(UPS)" },
  { "year": "F", "value": 0.228391, "type": "HVDC", "column": "HVDC" },
  { "year": "B", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "D", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "H", "value": 0, "type": "UPS", "column": "UPS" },
  { "year": "D", "value": 0.287525, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "H", "value": 0.139327, "type": "市电", "column": "市电" },
  { "year": "C", "value": 0.214243, "type": "HVDC", "column": "HVDC" },
  { "year": "E", "value": 0.341645, "type": "列头柜(市电)", "column": "列头柜(市电)" },
  { "year": "G", "value": 0.113145, "type": "HVDC", "column": "HVDC" },
  { "year": "E", "value": 0.117918, "type": "UPS", "column": "UPS" },
  { "year": "B", "value": 0.278456, "type": "HVDC", "column": "HVDC" },
  { "year": "E", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "G", "value": 0, "type": "UPS", "column": "UPS" },
  { "year": "F", "value": 0.176382, "type": "变压器", "column": "变压器" },
  { "year": "C", "value": 0.300014, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "A", "value": 0.25382, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "D", "value": 0.173778, "type": "UPS", "column": "UPS" },
  { "year": "H", "value": 0.220402, "type": "列头柜(HVDC)", "column": "列头柜(HVDC)" },
  { "year": "F", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "D", "value": 0.306388, "type": "列头柜(市电)", "column": "列头柜(市电)" },
  { "year": "B", "value": 0.324078, "type": "市电", "column": "市电" },
  { "year": "E", "value": 0.238933, "type": "HVDC", "column": "HVDC" },
  { "year": "F", "value": 0.08375, "type": "UPS", "column": "UPS" },
  { "year": "F", "value": 0.342799, "type": "列头柜(市电)", "column": "列头柜(市电)" },
  { "year": "B", "value": 0.251889, "type": "UPS", "column": "UPS" },
  { "year": "A", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "G", "value": 0, "type": "柴发", "column": "柴发" },
  { "year": "D", "value": 0.423935, "type": "变压器", "column": "变压器" },
  { "year": "B", "value": 0.40633, "type": "列头柜(市电)", "column": "列头柜(市电)" },
  { "year": "E", "value": 0.16701, "type": "市电", "column": "市电" },
  { "year": "A", "value": 0.193051, "type": "HVDC", "column": "HVDC" },
  { "year": "C", "value": 0, "type": "柴发", "column": "柴发" }
]

class checkSameData extends React.Component { 
  componentDidMount() {
    let cache = {};  
    let indices = [];
    tableData2.forEach((item, index) => { 
      let year = item.year;
      let _index = cache[year];
      if(_index !== undefined) {
        indices[_index].push(index)
      } else {
        cache[year] = indices.length
        indices.push([index])
      }
    })
    console.log('----indices----', indices);
    let result = [];
    indices.map((item) => {
      item.map((index) => {
        result.push(tableData2[index])
      })
    })
    console.log('----result---', result);
    return result;
  }
  render() {
    return (
      <div>1111</div>
    )
  }
}

export default checkSameData;
```