<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('admin', [DashboardController::class, 'index'])->name('admin.index');

Route::get('year', [DashboardController::class, 'changeYear'])->name('admin.year');

Route::get('month', [DashboardController::class, 'changeMonth'])->name('admin.month');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');