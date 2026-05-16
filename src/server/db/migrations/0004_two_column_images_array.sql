UPDATE blog_blocks
SET data = jsonb_build_object(
  'leftType', data->>'leftType',
  'rightType', data->>'rightType',
  'html', data->>'html',
  'leftImages',
    CASE WHEN data->>'leftImage' IS NOT NULL AND data->>'leftImage' != ''
    THEN jsonb_build_array(jsonb_build_object(
      'publicId', data->>'leftImage',
      'alt', COALESCE(data->>'leftImageAlt', '')
    ))
    ELSE '[]'::jsonb END,
  'rightImages',
    CASE WHEN data->>'rightImage' IS NOT NULL AND data->>'rightImage' != ''
    THEN jsonb_build_array(jsonb_build_object(
      'publicId', data->>'rightImage',
      'alt', COALESCE(data->>'rightImageAlt', '')
    ))
    ELSE '[]'::jsonb END
)
WHERE type = 'two_column';
