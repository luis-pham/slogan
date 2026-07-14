import { expect, test } from '@playwright/test';

test('home renders contest CTA', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /Đặt tên cho chuyến đi/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Tham gia ngay' })).toBeVisible();
});

test('join form starts with full submission details', async ({ page }) => {
  await page.goto('./join');
  await expect(page.getByLabel('Họ và tên')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Slogan' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Giải thích' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Gửi bài dự thi' })).toBeVisible();
});

test('wall shows submissions and leaderboard', async ({ page }) => {
  await page.goto('./wall');
  await expect(page.getByRole('heading', { name: /Danh sách dự thi/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bảng xếp hạng' })).toBeVisible();
});
