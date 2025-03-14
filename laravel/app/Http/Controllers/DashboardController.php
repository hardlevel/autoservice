<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;

class DashboardController extends Controller
{
    public function index(array $yearData = [], array $monthData = [])
    {
        $startYear = '2024';
        $currentYear = date('Y');

        if (empty($yearData)) {
            $yearData = $this->yearFilter();
            $stateYearData = $this->stateFilter();
        }
        if (empty($monthData)) {
            $monthData = $this->monthFilter();
            $stateMonthData = $this->stateFilterMonth();
        }

        return view('layouts.main', compact('stateMonthData', 'stateYearData', 'yearData', 'monthData', 'startYear', 'currentYear'));
    }

    public function yearFilter($year = 2024)
    {
        $labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

        $response = Http::acceptJson()->get('http://localhost:3000/autoservice/servicos-ano', compact('year'));
        $result = $response->json()['monthly'];
        $total = $response->json()['total'];
        $data = collect($labels)->map(function ($value, $key) use ($result) {
            $month = $key + 1;

            return isset($result[$month]) ? $result[$month] : 0;
        })->toArray();

        return compact('total', 'labels', 'data', 'year');
    }

    public function changeYear(Request $request)
    {
        $data = $this->yearFilter($request->year);
        // return view('layouts.main', compact('data'));
        return $this->index(yearData: $data);
    }

    public function changeMonth(Request $request)
    {
        $data = $this->monthFilter($request->year, $request->month);
        // return view('layouts.main', compact('data'));
        return $this->index(monthData: $data);
    }

    public function monthFilter($year = 2024, $month = 11)
    {
        $days = Carbon::now()->month($month)->daysInMonth;
        $labels = array_map('strval', range(1, $days));

        $response = Http::acceptJson()->get('http://localhost:3000/autoservice/servicos-mes', compact('year', 'month'));
        $result = $response->json()['daily'];
        $total = $response->json()['total'];

        $data = collect($labels)->map(function ($value, $key) use ($result) {
            $month = $key + 1;

            return isset($result[$month]) ? $result[$month] : 0;
        })->toArray();

        return compact('year', 'month', 'labels', 'data', 'total');
    }

    public function stateFilter($year = 2024)
    {
        $response = Http::acceptJson()->get('http://localhost:3000/autoservice/servicos-estado-ano', compact('year'));
        $result = $response->json();
        $labels = Arr::map($result, function ($value, $key) {
            return $value['uf'];
        });
        $data = Arr::map($result, function ($value, $key) {
            return $value['_count']['id'];
        });

        $total = array_sum($data);

        return compact('year', 'labels', 'data', 'total');
    }

    public function stateFilterMonth($year = 2024, $month = 11)
    {
        $response = Http::acceptJson()->get('http://localhost:3000/autoservice/servicos-estado', compact('year', 'month'));
        $result = $response->json();

        $labels = Arr::map($result, function ($value, $key) {
            return $value['uf'];
        });
        $data = Arr::map($result, function ($value, $key) {
            return $value['_count']['id'];
        });

        $total = array_sum($data);

        return compact('month', 'year', 'labels', 'data', 'total');
    }
}