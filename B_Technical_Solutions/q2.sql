SELECT 
    t.table_number,
    o.order_id,
    o.order_time,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'item_name', mi.name,
            'quantity', oi.quantity
            -- 'special_instructions', oi.special_instructions
        )
    ) AS items_ordered
FROM 
    orders o
JOIN 
    tables t ON o.table_id = t.table_id
JOIN 
    order_items oi ON o.order_id = oi.order_id
JOIN 
    menu_items mi ON oi.item_id = mi.item_id
WHERE 
    o.order_time >= NOW() - INTERVAL 1 HOUR
    AND o.status NOT IN ('paid', 'cancelled')
GROUP BY
    t.table_number, o.order_id, o.order_time
ORDER BY
    o.order_time DESC, t.table_number;
