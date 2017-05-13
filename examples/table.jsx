import React from 'react'
import ReactDOM from 'react-dom'
import Table from '../src/index.jsx'

const Page = React.createClass({
  render: function() {
    return (
      <div style={{width: 600, padding: '10px'}}>
        <Table
          fixedHeader
          className="table-bordered"
          width="100%"
          columns={[
            {key: 'x', title: '时间', fixed: 'left', render: (val) => {return <div style={{'whiteSpace': 'nowrap', display: 'inline-block'}}>{val}</div>}},
            {key: 'y0', title: '机锋机锋机锋'},
            {key: 'y1', title: 'UC', render: (val) => {return <div>{(val * 100) + '%'}</div>}},
            {key: 'y2', title: '华为商店华为商店'},
            {key: 'y3', title: '联想游戏中心'},
            {key: 'y4', title: '陌陌游戏'},
            {key: 'y5', title: '游戏汇游戏汇游戏汇'},
            {key: 'y6', title: 'OPPO游戏中心'},
            {key: 'y7', title: '百度'},
            {key: 'y8', title: '网易应用'},
            {key: 'y9', title: 'APP'},
            {key: 'y10', title: 'st'}
          ]}
          data={[
            {
              'y0': 0.0417,
              'y1': 0.0345,
              'y2': 0.0909,
              'y3': 0.1875,
              'y4': 1.3333,
              'y5': 0.25,
              'y6': 0.0455,
              'y7': 0.0476,
              'y8': 0.0769,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-01',
              'children': [
                {
                  'y0': 0.0417,
                  'y1': 0.0345,
                  'y2': 0.0909,
                  'y3': 0.1875,
                  'y4': 1.3333,
                  'y5': 0.25,
                  'y6': 0.0455,
                  'y7': 0.0476,
                  'y8': 0.0769,
                  'y9': 0.0453,
                  'y10': 0.0584,
                  'x': '2016-05-01'
                },
                {
                  'y0': 0.0417,
                  'y1': 0.0345,
                  'y2': 0.0909,
                  'y3': 0.1875,
                  'y4': 1.3333,
                  'y5': 0.25,
                  'y6': 0.0455,
                  'y7': 0.0476,
                  'y8': 0.0769,
                  'y9': 0.0453,
                  'y10': 0.0584,
                  'x': '2016-05-01'
                },
                {
                  'y0': 0.0417,
                  'y1': 0.0345,
                  'y2': 0.0909,
                  'y3': 0.1875,
                  'y4': 1.3333,
                  'y5': 0.25,
                  'y6': 0.0455,
                  'y7': 0.0476,
                  'y8': 0.0769,
                  'y9': 0.0453,
                  'y10': 0.0584,
                  'x': '2016-05-01'
                },
                {
                  'y0': 0.0417,
                  'y1': 0.0345,
                  'y2': 0.0909,
                  'y3': 0.1875,
                  'y4': 1.3333,
                  'y5': 0.25,
                  'y6': 0.0455,
                  'y7': 0.0476,
                  'y8': 0.0769,
                  'y9': 0.0453,
                  'y10': 0.0584,
                  'x': '2016-05-01'
                }
              ]
            },
            {
              'y0': 0.25,
              'y1': 1.2,
              'y2': 0.7143,
              'y3': 0.0455,
              'y4': 0.0976,
              'y5': 0.2857,
              'y6': 0.2667,
              'y7': 0.08,
              'y8': 0.1923,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-02'
            },
            {
              'y0': 0.7143,
              'y1': 0.0682,
              'y2': 0.16,
              'y3': "0.55565",
              'y4': 0.1026,
              'y5': 0.25,
              'y6': 0.6667,
              'y7': 0.6667,
              'y8': 0.0882,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-03'
            },
            {
              'y0': 0.0,
              'y1': 0.0526,
              'y2': 0.0455,
              'y3': 0.0,
              'y4': 0.2143,
              'y5': 0.0435,
              'y6': 0.3,
              'y7': 0.0385,
              'y8': 0.1875,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-04'
            },
            {
              'y0': 0.0093,
              'y1': 0.0,
              'y2': 0.0,
              'y3': 0.0149,
              'y4': 0.0072,
              'y5': 0.0,
              'y6': 0.0,
              'y7': 0.0,
              'y8': 0.0085,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-05'
            },
            {
              'y0': 0.1818,
              'y1': 0.0,
              'y2': 0.0909,
              'y3': 0.0714,
              'y4': 0.0,
              'y5': 0.25,
              'y6': 0.0435,
              'y7': 0.0,
              'y8': 0.4,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-06'
            },
            {
              'y0': 0.1818,
              'y1': 0.1429,
              'y2': 0.4706,
              'y3': 0.3333,
              'y4': 0.0784,
              'y5': 0.1739,
              'y6': 0.0455,
              'y7': 0.075,
              'y8': 1.0,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-07'
            },
            {
              'y0': 0.0,
              'y1': 0.2222,
              'y2': 0.2,
              'y3': 1.3333,
              'y4': 0.1538,
              'y5': 0.16,
              'y6': 0.0833,
              'y7': 0.0667,
              'y8': 0.2222,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-08'
            },
            {
              'y0': 0.1905,
              'y1': 0.2222,
              'y2': 0.0323,
              'y3': 0.122,
              'y4': 0.2,
              'y5': 0.0,
              'y6': 0.1379,
              'y7': 0.4444,
              'y8': 0.4167,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-09'
            },
            {
              'y0': 0.0508,
              'y1': 0.08,
              'y2': 0.25,
              'y3': 0.1026,
              'y4': 0.0,
              'y5': 0.0606,
              'y6': 0.08,
              'y7': 0.075,
              'y8': 0.0789,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-10'
            },
            {
              'y0': 0.0566,
              'y1': 0.0556,
              'y2': 0.2,
              'y3': 0.4444,
              'y4': 0.0,
              'y5': 0.0,
              'y6': 0.1111,
              'y7': 0.2,
              'y8': 0.3636,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-11'
            },
            {
              'y0': 0.0452,
              'y1': 0.0417,
              'y2': 0.0267,
              'y3': 0.0316,
              'y4': 0.0476,
              'y5': 0.0216,
              'y6': 0.0438,
              'y7': 0.0342,
              'y8': 0.0719,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-12'
            },
            {
              'y0': 0.0,
              'y1': 0.0055,
              'y2': 0.0061,
              'y3': 0.0068,
              'y4': 0.0,
              'y5': 0.0051,
              'y6': 0.0063,
              'y7': 0.0,
              'y8': 0.0176,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-13'
            },
            {
              'y0': 0.5455,
              'y1': 1.1765,
              'y2': 1.0,
              'y3': 0.6111,
              'y4': 0.6538,
              'y5': 1.0,
              'y6': 0.8333,
              'y7': 0.5455,
              'y8': 0.5333,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-14'
            },
            {
              'y0': 0.0248,
              'y1': 0.01,
              'y2': 0.0366,
              'y3': 0.0114,
              'y4': 0.0117,
              'y5': 0.0223,
              'y6': 0.0061,
              'y7': 0.0112,
              'y8': 0.0167,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-15'
            },
            {
              'y0': 0.0409,
              'y1': 0.0392,
              'y2': 0.035,
              'y3': 0.025,
              'y4': 0.0223,
              'y5': 0.0058,
              'y6': 0.0438,
              'y7': 0.0225,
              'y8': 0.0323,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-16'
            },
            {
              'y0': 0.0788,
              'y1': 0.0833,
              'y2': 0.0944,
              'y3': 0.0816,
              'y4': 0.0582,
              'y5': 0.0526,
              'y6': 0.0691,
              'y7': 0.0807,
              'y8': 0.0811,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-17'
            },
            {
              'y0': 0.0337,
              'y1': 0.011,
              'y2': 0.0185,
              'y3': 0.0052,
              'y4': 0.0111,
              'y5': 0.0238,
              'y6': 0.0173,
              'y7': 0.0223,
              'y8': 0.0233,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-18'
            },
            {
              'y0': 0.0389,
              'y1': 0.0237,
              'y2': 0.016,
              'y3': 0.0595,
              'y4': 0.0327,
              'y5': 0.024,
              'y6': 0.0343,
              'y7': 0.0273,
              'y8': 0.0229,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-19'
            },
            {
              'y0': 0.0186,
              'y1': 0.0139,
              'y2': 0.0192,
              'y3': 0.0157,
              'y4': 0.0222,
              'y5': 0.0267,
              'y6': 0.0165,
              'y7': 0.0125,
              'y8': 0.0108,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-20'
            },
            {
              'y0': 0.0714,
              'y1': 0.0974,
              'y2': 0.085,
              'y3': 0.0966,
              'y4': 0.0676,
              'y5': 0.0823,
              'y6': 0.0785,
              'y7': 0.0694,
              'y8': 0.0359,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-21'
            },
            {
              'y0': 0.0247,
              'y1': 0.0355,
              'y2': 0.0238,
              'y3': 0.0368,
              'y4': 0.0364,
              'y5': 0.0284,
              'y6': 0.0216,
              'y7': 0.0166,
              'y8': 0.0108,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-22'
            },
            {
              'y0': 0.0106,
              'y1': 0.0117,
              'y2': 0.0062,
              'y3': 0.0076,
              'y4': 0.0061,
              'y5': 0.0108,
              'y6': 0.0188,
              'y7': 0.0164,
              'y8': 0.0064,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-23'
            },
            {
              'y0': 0.023,
              'y1': 0.0191,
              'y2': 0.0185,
              'y3': 0.0301,
              'y4': 0.006,
              'y5': 0.027,
              'y6': 0.0,
              'y7': 0.0138,
              'y8': 0.0171,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-24'
            },
            {
              'y0': 0.0226,
              'y1': 0.0219,
              'y2': 0.0064,
              'y3': 0.0123,
              'y4': 0.0062,
              'y5': 0.0173,
              'y6': 0.0166,
              'y7': 0.0064,
              'y8': 0.0168,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-25'
            },
            {
              'y0': 0.0055,
              'y1': 0.0223,
              'y2': 0.0122,
              'y3': 0.0262,
              'y4': 0.0123,
              'y5': 0.0054,
              'y6': 0.0364,
              'y7': 0.0112,
              'y8': 0.0,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-26'
            },
            {
              'y0': 0.0052,
              'y1': 0.0057,
              'y2': 0.0112,
              'y3': 0.0197,
              'y4': 0.0145,
              'y5': 0.0056,
              'y6': 0.019,
              'y7': 0.0169,
              'y8': 0.0061,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-27'
            },
            {
              'y0': 0.0107,
              'y1': 0.0139,
              'y2': 0.0461,
              'y3': 0.0116,
              'y4': 0.0242,
              'y5': 0.033,
              'y6': 0.0231,
              'y7': 0.0318,
              'y8': 0.0282,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-28'
            },
            {
              'y0': 0.006,
              'y1': 0.0237,
              'y2': 0.0132,
              'y3': 0.0,
              'y4': 0.0062,
              'y5': 0.0241,
              'y6': 0.0062,
              'y7': 0.0171,
              'y8': 0.0255,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-29'
            },
            {
              'y0': 0.0514,
              'y1': 0.0655,
              'y2': 0.0718,
              'y3': 0.0519,
              'y4': 0.0533,
              'y5': 0.0374,
              'y6': 0.0467,
              'y7': 0.0368,
              'y8': 0.0269,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-30'
            },
            {
              'y0': 0.0818,
              'y1': 0.0671,
              'y2': 0.0506,
              'y3': 0.0726,
              'y4': 0.0377,
              'y5': 0.0761,
              'y6': 0.0632,
              'y7': 0.0679,
              'y8': 0.0698,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-05-31'
            },
            {
              'y0': 0.0739,
              'y1': 0.0289,
              'y2': 0.0473,
              'y3': 0.0636,
              'y4': 0.0756,
              'y5': 0.0757,
              'y6': 0.0311,
              'y7': 0.1,
              'y8': 0.0659,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-01'
            },
            {
              'y0': 0.0724,
              'y1': 0.0678,
              'y2': 0.0783,
              'y3': 0.0675,
              'y4': 0.0651,
              'y5': 0.067,
              'y6': 0.0872,
              'y7': 0.0894,
              'y8': 0.0578,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-02'
            },
            {
              'y0': 0.0275,
              'y1': 0.0137,
              'y2': 0.0133,
              'y3': 0.0359,
              'y4': 0.0256,
              'y5': 0.0126,
              'y6': 0.0294,
              'y7': 0.0313,
              'y8': 0.0336,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-03'
            },
            {
              'y0': 0.0495,
              'y1': 0.0549,
              'y2': 0.0833,
              'y3': 0.0313,
              'y4': 0.0612,
              'y5': 0.0625,
              'y6': 0.04,
              'y7': 0.0847,
              'y8': 0.0335,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-04'
            },
            {
              'y0': 0.0115,
              'y1': 0.0172,
              'y2': 0.02,
              'y3': 0.0121,
              'y4': 0.0061,
              'y5': 0.0103,
              'y6': 0.0,
              'y7': 0.0064,
              'y8': 0.016,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-05'
            },
            {
              'y0': 0.0636,
              'y1': 0.0375,
              'y2': 0.0683,
              'y3': 0.0226,
              'y4': 0.0485,
              'y5': 0.0599,
              'y6': 0.0855,
              'y7': 0.0398,
              'y8': 0.0438,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-06'
            },
            {
              'y0': 0.0703,
              'y1': 0.0606,
              'y2': 0.0706,
              'y3': 0.0351,
              'y4': 0.0316,
              'y5': 0.0656,
              'y6': 0.0479,
              'y7': 0.061,
              'y8': 0.0581,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-07'
            },
            {
              'y0': 0.0679,
              'y1': 0.0941,
              'y2': 0.0726,
              'y3': 0.0592,
              'y4': 0.0535,
              'y5': 0.0909,
              'y6': 0.0497,
              'y7': 0.0442,
              'y8': 0.0248,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-08'
            },
            {
              'y0': 0.0057,
              'y1': 0.0159,
              'y2': 0.0053,
              'y3': 0.0053,
              'y4': 0.0058,
              'y5': 0.0175,
              'y6': 0.0128,
              'y7': 0.0112,
              'y8': 0.0057,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-09'
            },
            {
              'y0': 0.0357,
              'y1': 0.0443,
              'y2': 0.0696,
              'y3': 0.0655,
              'y4': 0.0464,
              'y5': 0.0341,
              'y6': 0.0802,
              'y7': 0.0602,
              'y8': 0.0272,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-10'
            },
            {
              'y0': 0.0,
              'y1': 0.0167,
              'y2': 0.0,
              'y3': 0.0,
              'y4': 0.0058,
              'y5': 0.0,
              'y6': 0.0057,
              'y7': 0.0059,
              'y8': 0.0103,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-11'
            },
            {
              'y0': 0.0333,
              'y1': 0.0263,
              'y2': 0.0385,
              'y3': 0.0,
              'y4': 0.0,
              'y5': 0.0,
              'y6': 0.0,
              'y7': 0.0612,
              'y8': 0.0,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-12'
            },
            {
              'y0': 0.0407,
              'y1': 0.0651,
              'y2': 0.0596,
              'y3': 0.0503,
              'y4': 0.0462,
              'y5': 0.0552,
              'y6': 0.0265,
              'y7': 0.0511,
              'y8': 0.0513,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-13'
            },
            {
              'y0': 0.0291,
              'y1': 0.0054,
              'y2': 0.0166,
              'y3': 0.011,
              'y4': 0.0201,
              'y5': 0.0118,
              'y6': 0.0131,
              'y7': 0.0,
              'y8': 0.0,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-14'
            },
            {
              'y0': 0.0068,
              'y1': 0.0174,
              'y2': 0.0057,
              'y3': 0.0116,
              'y4': 0.0126,
              'y5': 0.0055,
              'y6': 0.0189,
              'y7': 0.0119,
              'y8': 0.0057,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-15'
            },
            {
              'y0': 0.0065,
              'y1': 0.0062,
              'y2': 0.0203,
              'y3': 0.0,
              'y4': 0.0,
              'y5': 0.0,
              'y6': 0.006,
              'y7': 0.0055,
              'y8': 0.0126,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-16'
            },
            {
              'y0': 0.0578,
              'y1': 0.0405,
              'y2': 0.071,
              'y3': 0.0449,
              'y4': 0.0722,
              'y5': 0.0389,
              'y6': 0.0375,
              'y7': 0.0493,
              'y8': 0.0556,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-17'
            },
            {
              'y0': 0.0,
              'y1': 0.0116,
              'y2': 0.0157,
              'y3': 0.0113,
              'y4': 0.0121,
              'y5': 0.0191,
              'y6': 0.0115,
              'y7': 0.0098,
              'y8': 0.0055,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-18'
            },
            {
              'y0': 0.0056,
              'y1': 0.0108,
              'y2': 0.0189,
              'y3': 0.0181,
              'y4': 0.0098,
              'y5': 0.0173,
              'y6': 0.0114,
              'y7': 0.006,
              'y8': 0.0057,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-19'
            },
            {
              'y0': 0.0114,
              'y1': 0.0071,
              'y2': 0.0196,
              'y3': 0.0118,
              'y4': 0.012,
              'y5': 0.0111,
              'y6': 0.0173,
              'y7': 0.0121,
              'y8': 0.0181,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-20'
            },
            {
              'y0': 0.0,
              'y1': 0.0057,
              'y2': 0.006,
              'y3': 0.0113,
              'y4': 0.0181,
              'y5': 0.0056,
              'y6': 0.0064,
              'y7': 0.0,
              'y8': 0.0118,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-21'
            },
            {
              'y0': 0.2273,
              'y1': 0.2308,
              'y2': 0.25,
              'y3': 0.375,
              'y4': 0.2162,
              'y5': 0.2647,
              'y6': 0.4054,
              'y7': 0.3333,
              'y8': 0.2917,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-22'
            },
            {
              'y0': 0.0857,
              'y1': 0.044,
              'y2': 0.0426,
              'y3': 0.0307,
              'y4': 0.0719,
              'y5': 0.0549,
              'y6': 0.0316,
              'y7': 0.0694,
              'y8': 0.0291,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-23'
            },
            {
              'y0': 0.051,
              'y1': 0.1006,
              'y2': 0.0412,
              'y3': 0.0595,
              'y4': 0.0854,
              'y5': 0.0552,
              'y6': 0.0533,
              'y7': 0.0513,
              'y8': 0.0273,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-24'
            },
            {
              'y0': 0.0,
              'y1': 0.0063,
              'y2': 0.0056,
              'y3': 0.0,
              'y4': 0.0057,
              'y5': 0.0,
              'y6': 0.0,
              'y7': 0.0,
              'y8': 0.0,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-25'
            },
            {
              'y0': 0.098,
              'y1': 0.1702,
              'y2': 0.1136,
              'y3': 0.06,
              'y4': 0.0667,
              'y5': 0.1607,
              'y6': 0.1639,
              'y7': 0.1186,
              'y8': 0.1364,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-26'
            },
            {
              'y0': 0.0255,
              'y1': 0.0123,
              'y2': 0.0129,
              'y3': 0.0118,
              'y4': 0.0074,
              'y5': 0.0061,
              'y6': 0.0,
              'y7': 0.006,
              'y8': 0.0226,
              'y9': 0.0453,
              'y10': 0.0584,
              'x': '2016-06-27'
            }
          ]}
        />
      </div>
    )
  }
})

ReactDOM.render(
  <Page />,
  document.getElementById('container')
)
