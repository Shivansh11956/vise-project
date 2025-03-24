
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('incomeOrderChart').getContext('2d');

    
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, 'rgba(0, 128, 0, 0.3)'); 
    gradient1.addColorStop(1, 'rgba(0, 128, 0, 0)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, 'rgba(50, 205, 50, 0.3)'); 
    gradient2.addColorStop(1, 'rgba(50, 205, 50, 0)');

    const data = {
        labels: ['Sep 07', 'Sep 08', 'Sep 09', 'Sep 10', 'Sep 11', 'Sep 12', 'Sep 13'],
        datasets: [
            {
                label: 'Order',
                data: [3, 7500, 5000, 4300, 4800, 6200, 7000],
                borderColor: 'black',
                borderWidth: 1,
                fill: false,
                tension: 0.5,  
                pointBackgroundColor: 'transparent',
                pointRadius: 2
            },
            {
                label: 'Income Growth',
                data: [7000, 6000,-10, 8000, 9000, 7200, 6800, 7600],
                borderColor: 'black',
                borderWidth: 0.5,
                fill: false,
                tension: 0.5, 
                pointBackgroundColor: 'transparent',
                pointRadius: 2
            }
        ]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: { tension: 0.5 },
                point: { radius: 4 }
            },
            scales: {
                y: {
                    grid: { display : false },
                    ticks: { stepSize: 2000 }
                },
                x: {
                    grid: { color: 'rgba(200, 200, 200, 0.3)' }
                }
            },
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(tooltipItem) {
                            return `$${tooltipItem.raw.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    });
});
