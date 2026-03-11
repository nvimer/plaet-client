# O(N^2) Algorithm in groupOrders causing UI Jank

*   **ID:** 1741651300
*   **Date:** 2026-03-10
*   **Description:** The `groupOrders` utility function was using a nested loop (`for` within `for`) to group orders by time windows, leading to O(N^2) complexity. This caused noticeable UI freezes when processing hundreds of orders.
*   **Root Cause:** Inefficient search strategy comparing every order against every other order to find time-proximate neighbors.
*   **Solution:** Replaced the nested loops with a single-pass Hash Map approach (O(N)). Orders are now bucketed based on a calculated time-key (`Math.floor(timestamp / windowMs)`). This reduced processing time from milliseconds to microseconds for large datasets.
