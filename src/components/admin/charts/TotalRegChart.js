import React from 'react';
import {Pie} from 'react-chartjs-2';

const data = {
    labels: ['Academic', 'General'],
    datasets: [
        {
            label: '# of Votes',
            data: [400, 320],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

const PieChart = () => (
    <>
        <div className='header'>
            <h2 className='title'>Total Registered Users Breakdown</h2>
        </div>
        <Pie data={data}/>
    </>
);

export default PieChart;